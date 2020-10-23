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
这对于实现多路merge和生产者消费者队列十分有帮助。生产者消费者对咧会有很多client同时对文件追加，并且不需要额外的锁开销。

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
