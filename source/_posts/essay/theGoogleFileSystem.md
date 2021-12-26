---
title: The Google File System 谷歌文件系统 笔记
date: 2020-01-16 22:01:25
description: The Google File System(GFS) 是Google 2003 年公布的分布式存储文件系统。 
categories: 学习笔记
tags:
- Google
- 存储
- 文件系统
- Google File System
---

[The Google File System](https://static.googleusercontent.com/media/research.google.com/zh-CN//archive/gfs-sosp2003.pdf)

## 介绍

Google File System 是一个可扩展的分布式文件系统，为大规模分布式数据密集型应用提供服务。它提供了在廉价硬件基础上的灾难冗余，以及对大量客户的高性能服务。

Google File System 是基于谷歌应用的负载和技术环境进行设计的:

## 设计概述

### 假设/前提

* 组件故障是正常现象而不是意外
* 以传统的标准来说，我们的文件是十分巨大的
* 大部分文件都只进行数据追加，而不是覆盖现存的数据
* 应用程序和文件系统API（应用接口）协同设计提高了整体的灵活性
* 高持续带宽比低延迟更重要

### 接口设计

文件被文件夹组织，通过路径名识别。支持通常操作，比如创建，删除，打开，关闭，读写。
GFS还支持快照*snapshot*和记录追加*record append*操作

#### 快照

快照以很低的代价创建一个文件或者文件目录树的副本。

#### 记录追加

Record append 允许多个client对同一个文件并行追加数据。同时保障每个单独client追加的原子性。
这对于实现多路merge和生产者消费者队列十分有帮助。生产者消费者队列会有很多client同时对文件追加，并且不需要额外的锁开销。

### 系统架构

* 一个GFS集群包括一个*master*和多个*chunkserver*
* 文件被切割成固定64bit大小的文件块*chunk*
* chunkserver会把chunk保存在本地磁盘上，比如保存成linux文件
* 每个chunk会被保存在多个chunkserver上以保证可靠性。默认3个副本
* master保存有所有文件系统元数据metadata。包括命名空间namespace，访问控制数据，文件到chunk的映射，和chunk目前的位置
* master同时负责控制系统级别的活动，比如chunk租用管理，未分配chunk的回收，和chunkserver之间chunk的转移
* master定期通过心跳信息对chunkserver发送信息和获取它们的状态

* GFS client实现文件系统API和与master的交流。以及代表应用对chunkserver进行读写。
* client可以和master进行对元数据的操作，但是所有对数据的操作直接和chunksserver交流。

* client或者chunkserver都不会缓存文件数据。chunkserver自动获得缓存，因为文件是储存在本地linux文件的。

### 单点master

简化设计，方便master基于全局共识做复杂的chunk和复制逻辑。
尽量减少读写，保证单点master不是瓶颈。
客户端不会直接从master读取写入文件数据。
客户端通过master问出具体应该联系哪个chunkserver

### Chunk Size 块大小

我们选择64MB作为chunk size。每一个chunk replica被当作普通的linux文件存放在chunk server上。
大chunk size 有以下优点：
*   减少客户端和master的联系。对同一块的读写只需要向master发送一个初始请求，以获得chunk位置信息。对我们的workload来说，这种减少更为重要，因为应用一般顺序读写大文件。就算是小随机读，客户端也可以轻松缓存所有chunk位置信息。
*   对于一个大chunk，客户端更加倾向于对一个chunk做很多操作。这样可以减少向chunkserver保持持续TCP链接的网络开销。
*   减少master上存放的metadata元数据的小。这样可以保证我们能在内存中保存metadata。

但是大chunk size也有缺点。小文件只会有很少的chunk，甚至只有一个chunk。存放这些chunk的chunkserver会变成hotspot热点，如果有很多用户一起访问同一个文件。

如果真的出现这种情况，可以提高replication factor，复制更多副本，流量就可以被分散。

### 元数据Metadata

master保存三种主要metadata：

1.  文件和块chunk的命名空间namespace
2.  从文件到块chunk的mapping映射
3.  各个块chunk的replicas副本位置

前两种metadata是通过logging mutation来保证可靠性的。也就是通过操作日志operation log来更新master状态。
master不会持续存储chunk块位置，而是在服务启动或者chunkserver加入时询问每一个chunkserver。

#### 内存数据类型 In-Memory Data Structures

#### 块位置 Chunk Locations

master 通过心跳信息 来控制所有块位置和监视chunkserver状态。
持续地保持块位置信息会使得master难以与chunkserver同步。因为chunkserver会频繁的加入或者离开集群，更名，失败，重启，等等操作。

另外就是所有chunk的groundtruth都被存在chunkserver上。在master上保持这些信息同步并无必要。

#### 操作日志 Operation Log

操作日志包含了重要的元数据改变的历史记录。它在GFS上是中心化存储的。这不仅仅是唯一的元数据持久化记录，也是确定并发操作顺序的逻辑时间序。文件和块，以及他们的版本，全都可以通过逻辑创建时间唯一且永久地得到辨认。

操作日志是十分重要的，我们必须确保日志被可靠地存储。除非元数据的更改被持久化了，否则用户不应该看到日志变化。不然的话，即使chunk块依然存在，我们也有可能丢失整个文件系统，或者最近的用户操作。

因此我们会把日志复制到多台远程机器上。而且只有当远程和本地都落盘后，才会响应客户的操作。master会收集多个日志批量处理，以减轻落盘和制造副本对整个系统吞吐量的影响。

master通过重放操作日志实现文件系统状态的完全恢复。为了减少启动时间，我们必须保证日志足够小。
每当日志大小增长超过一定阈值，master就会保存一个checkpoint（检查点，类似于快照的操作）。这样如果系统需要重启，只需要加载最近的checkpoint和checkpoint点之后的一小部分日志。

checkpoint是一个压缩的类似B树的形式，可以被直接存放在内存中，并且不需要额外的parsing就可以查询namespace。这可以加速恢复和提高可用性。

因为创建checkpoint会花费一定时间，master的内部状态被设置成:不需要延迟创建mutation的情况下，同时还能创建新的checkpoint。master会创建一个新的日志文件，并且在另一个线程中创建新的checkpoint。新的checkpoint包含转换日志文件之前所有的mutation。对于一个接近百万个文件的集群来说，这个文件可以在一分钟内被创建。完成之后，文件会被写入本地以及远程。

恢复只需要最新的checkpoint和紧接着的日志文件。旧的checkpoint和日志文件都可以被删除，但为了灾难恢复，我们还是会保留一些。保存checkpoint中间发生的失败不会影响正确性，因为恢复的代码会检查和跳过不完整的checkpoint。

### 一致性模型

GFS有着一个放松的一致性模型。

#### GFS的保证

文件命名空间操作是原子性的（创建文件之类的）。他们被master互斥性地处理:
* 命名空间锁保证原子性和正确性
* master的操作日志决定了这些操作的全局有序性

在一次数据变更后，文件区域状态取决于数据变更的类型:
* 操作成功或失败
* 同一时间有没有并行的操作

![](/media/gfs/table1_file_region_state_after_mutation.png)

如果所有用户总是看到相同的数据（不管他们是从哪个副本读取），那么这个文件区域称为*一致的consistent*。

如果是一致的，而且用户可以看到整个变化的内容，这个区域称为*已定义的defined*。

1. 当一个变更成功发生（不被并行写入打扰），受影响的区域是已定义的（同时隐含是一致的）:所有用户总是会看到变更写入了什么。

2. 并行成功变更会使区域变得未定义但一致: