---
title: 史上最简单的 mit 6.824 分布式系统 Lab 1 MapReduce Part 1/2
date: 2022-01-21 09:31:52
categories: 分布式系统
description: 史上最简单的 mit 6.824 分布式系统 Lab 1 MapReduce Part 1/2,未完成crash test部分
tags:
- 分布式系统
- mit6.824
- MapReduce
---

[6.824 Lab 1: MapReduce](http://nil.csail.mit.edu/6.824/2021/labs/lab-mr.html)

# 下载代码

```bash
git clone git://g.csail.mit.edu/6.824-golabs-2021 6.824
```

# 遇到的坑

## cannot find module for path 

[参考](https://stackoverflow.com/questions/63871687/golang-build-cannot-find-module-for-path-mnt-c-xxxxx)

在6.824根目录下执行

```go
go mod init "6.824-golabs-2021" 
```

然后把所有

```go
import "6.824/mr"
```

改成

```go
import "6.824-golabs-2021/src/mr"
```

## test-mr.sh: line 165: timeout: command not found

```bash
brew install coreutils
alias timeout=gtimeout
```

## 在macos zsh上 wait: -n: invalid option

```bash
test-mr.sh: line 202: wait: -n: invalid option
wait: usage: wait [n]
```
解决方法：

升级bash

```bash
brew install bash
which -a bash
/opt/homebrew/bin/bash
/bin/bash
```

更改test-mr.sh第一行

```bash
#!/opt/homebrew/bin/bash
```

# 系统设计

## 任务介绍

这个lab只需要我们填写src/mr/coordinator.go src/mr/rpc.go和src/mr/worker.go

流程就是，每一个输入文件对应一个mapper(实际工作中其实mapper是可以处理多个文件的)，一个mapper根据nReduce把输出拆成多个文件mr-tmp-{mapper_id}-{reduce_id}

一个reducer根据输入mr-tmp-*-{reduce_id}进行聚合

## coordinator.go 数据结构与功能代码

即mapreduce中的master角色。用于切分任务，worker来请求时分派任务。

PS. 不要在coordinator里面维护worker状态，这并非必要。coordinator只需要管理task即可，只要任务完成了，根本不需要管到底是哪个worker做事情。

### MrTask

因为worker里面包括了mapper和reducer，所以设计任务类型Task的时候，我也把两种任务塞在一个MrTask类中。
MrTaskType用于区分是Map任务还是Reduce任务。Id是全局unique_id。ReduceTaskId是reducer要根据自己在所有reducer中的id读取输入文件。

```go
type MrTaskType int

const (
	MapTask    MrTaskType = 0
	ReduceTask MrTaskType = 1
)

type MrTask struct {
	Id                   int
	MapperInputFilenames []string
	OutputFilenamePrefix string
	TaskType             MrTaskType
	MapperNumber         int
	ReducerNumber        int
	ReduceTaskId         int
}
```

### Coordinator

用于存放Coordinator本身状态的类。这里MapperTasks和ReducerTasks用于存放未执行任务，使用channel获得天然的线程安全性。

RunningTaskMap用于存放跟踪正在运行的任务，使用runningTaskMapMutex加锁防止race condition。

当一个任务完成的时候，直接从map中删除。

注意CoordinatorState不需要存放，根据实际情况实时计算出结果即可。

```go
type CoordinatorState int

const (
	MapStage    CoordinatorState = 0
	ReduceStage CoordinatorState = 1
	Done        CoordinatorState = 2
)

type Coordinator struct {
	MapperTasks         chan *MrTask
	ReducerTasks        chan *MrTask
	RunningTaskMap      map[int]*MrTask
	runningTaskMapMutex sync.Mutex
	// mapNumber 一共有几个map task
	mapNumber int
	// reduceNumber 一共有几个reduce task
	reduceNumber  int
	currentTaskId int
}
```

### MakeCoordinator 初始化Coordinator

```go
func (c *Coordinator) createMapperTasks(files []string) {
	for _, filename := range files {
		c.MapperTasks <- &MrTask{
			Id:                   c.currentTaskId,
			MapperInputFilenames: []string{filename},
			OutputFilenamePrefix: "mr-tmp",
			TaskType:             MapTask,
			ReducerNumber:        c.reduceNumber,
		}
		c.currentTaskId += 1
	}
}

func (c *Coordinator) createReducerTasks() {
	for i := 0; i < c.reduceNumber; i++ {
		c.ReducerTasks <- &MrTask{
			Id:                   c.currentTaskId,
			OutputFilenamePrefix: "mr-out",
			TaskType:             ReduceTask,
			MapperNumber:         c.mapNumber,
			ReducerNumber:        c.reduceNumber,
			ReduceTaskId:         i,
		}
		c.currentTaskId += 1
	}
}

//
// create a Coordinator.
// main/mrcoordinator.go calls this function.
// nReduce is the number of reduce tasks to use.
//
func MakeCoordinator(files []string, nReduce int) *Coordinator {
	c := Coordinator{
		reduceNumber:   nReduce,
		currentTaskId:  0,
		ReducerTasks:   make(chan *MrTask, nReduce),
		MapperTasks:    make(chan *MrTask, len(files)),
		mapNumber:      len(files),
		RunningTaskMap: make(map[int]*MrTask),
	}
	// Your code here.
	c.createMapperTasks(files)
	c.createReducerTasks()
	c.server()
	return &c
}
```

### Done

当所有channel和map都清空，说明所有任务都完成了。

```go
//
// main/mrcoordinator.go calls Done() periodically to find out
// if the entire job has finished.
//
func (c *Coordinator) Done() bool {
	c.runningTaskMapMutex.Lock()
	done := len(c.RunningTaskMap) == 0 && len(c.MapperTasks) == 0 && len(c.ReducerTasks) == 0
	c.runningTaskMapMutex.Unlock()
	return done
}
```

### getState 获得现在状态（map or reduce or done）

这里分三种情况：
1. Done：那就返回Done
2. Reduce：如果ReduceTaskChannel的task数量少了，说明正在消耗reduce task，自然是reduce stage。唯一的边界条件是，map和map task channel全为空，这说明也是reduce状态，因为map状态没有task了。
3. Map：剩下的所有情况都是map stage

```go
func (c *Coordinator) getState() CoordinatorState {
	if c.Done() {
		return Done
	}
	c.runningTaskMapMutex.Lock()
	runningTaskNumber := len(c.RunningTaskMap)
	c.runningTaskMapMutex.Unlock()
	// 正在消耗reduceTask，或者mapper为0而且正在运行的task为0，都说明现在是reduce stage
	if len(c.ReducerTasks) < c.reduceNumber ||
		(runningTaskNumber == 0 && len(c.MapperTasks) == 0) {
		return ReduceStage
	} else {
		return MapStage
	}
}
```

## rpc.go

定义rpc接口和请求返回类型。注意FinishTaskRequest里面其实只需要返回TaskId，其他内容都不是必要的。

```go
type GetTaskRequest struct{}

type GetTaskStatus int

const (
	Run     GetTaskStatus = 0
	Wait    GetTaskStatus = 1
	AllDone GetTaskStatus = 2
)

type GetTaskResponse struct {
	Task   MrTask
	Status GetTaskStatus
}

type FinishTaskRequest struct {
	TaskId int
}

type FinishTaskResponse struct{}
```

## worker.go

用于执行mapreduce中的mapper和reducer任务
