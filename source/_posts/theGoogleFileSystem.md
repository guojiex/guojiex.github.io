---
title: The Google File System 谷歌文件系统 笔记(TBD)
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

# 介绍

Google File System 是一个可扩展的分布式文件系统，为大规模分布式数据密集型应用提供服务。它提供了在廉价硬件基础上的灾难冗余，以及对大量客户的高性能服务。

Google File System 是基于谷歌应用的负载和技术环境进行设计的:

# 设计概述

## 假设/前提

*   组件故障是正常现象而不是意外
*   以传统的标准来说，我们的文件是十分巨大的
*   大部分文件都只进行数据追加，而不是覆盖现存的数据
*   应用程序和文件系统API（应用接口）协同设计提高了整体的灵活性
*   高持续带宽比低延迟更重要

## 接口设计

文件被文件夹组织，通过路径名识别。支持通常操作，比如创建，删除，打开，关闭，读写。
GFS还支持快照*snapshot*和记录追加*record append*操作

### 快照

快照以很低的代价创建一个文件或者文件目录树的副本。

