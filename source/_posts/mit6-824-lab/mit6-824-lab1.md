---
title: 分布式系统 mit 6.824 Lab 1 MapReduce Part 1/2
date: 2022-01-21 09:31:52
categories: 分布式系统
description: 分布式系统 mit 6.824 Lab 1 MapReduce Part 1/2,未完成crash test部分
tags:
- 分布式系统
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

这个lab只需要我们填写src/mr/coordinator.go src/mr/rpc.go和src/mr/worker.go

流程就是，每一个输入文件对应一个mapper，一个mapper根据nReduce把输出拆成多个文件mr-tmp-{mapper_id}-{reduce_id}

一个reducer根据输入mr-tmp-*-{reduce_id}进行聚合

## coordinator.go

即mapreduce中的master角色。用于切分任务，worker来请求时分派任务。

## rpc.go

## worker.go

用于执行mapreduce中的mapper和reducer任务

# 代码

## coordinator.go

```go
package mr

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"net/rpc"
	"os"
	"sync"
	"time"
)

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

type CoordinatorState int

const (
	MapStage    CoordinatorState = 0
	ReduceStage CoordinatorState = 1
	Done        CoordinatorState = 2
)

type Coordinator struct {
	// Your definitions here.
	MapperTasks         chan *MrTask
	ReducerTasks        chan *MrTask
	RunningTaskMap      map[int]*MrTask
	mapNumber           int
	reduceNumber        int
	currentTaskId       int
	runningTaskMapMutex sync.Mutex
}

const (
	checkTaskTimeout      = 10 * time.Second
	channelGetTaskTimeout = 1 * time.Second
)

// Your code here -- RPC handlers for the worker to call.

// timerCheckTaskTimeout 超时回调函数。如果task超过时间没有完成，就把task从RunningTaskMap移除，重新发送回taskChannel
func (c *Coordinator) timerCheckTaskTimeout(taskChannel chan *MrTask, task *MrTask) {
	timer := time.AfterFunc(checkTaskTimeout, func() {
		c.runningTaskMapMutex.Lock()
		if _, ok := c.RunningTaskMap[task.Id]; ok {
			fmt.Printf("[WARNING] task timeout %v", *task)
			delete(c.RunningTaskMap, task.Id)
			taskChannel <- task
		}
		c.runningTaskMapMutex.Unlock()
	})
	defer timer.Stop()
}

// emitTask 根据channel是否有返回，决定是让worker wait或者派发任务
func (c *Coordinator) emitTask(taskChannel chan *MrTask, response *GetTaskResponse) {
	timeout := time.After(channelGetTaskTimeout)
	select {
	case task := <-taskChannel:
		c.runningTaskMapMutex.Lock()
		c.RunningTaskMap[task.Id] = task
		c.runningTaskMapMutex.Unlock()
		c.timerCheckTaskTimeout(taskChannel, task)
		response.Task = *task
		response.Status = Run
	case <-timeout:
		response.Status = Wait
	}
}

// GetTask 处理rpc GetTask请求
func (c *Coordinator) GetTask(request *GetTaskRequest,
	response *GetTaskResponse) error {
	if c.Done() {
		response.Status = AllDone
		return nil
	}
	currentState := c.getState()
	switch currentState {
	case MapStage:
		c.emitTask(c.MapperTasks, response)
	case ReduceStage:
		c.emitTask(c.ReducerTasks, response)
	}
	return nil
}

// FinishTask 处理rpc FinishTask请求，把task从RunningTaskMap删除
func (c *Coordinator) FinishTask(request *FinishTaskRequest,
	reply *FinishTaskResponse) error {
	c.runningTaskMapMutex.Lock()
	delete(c.RunningTaskMap, request.TaskId)
	c.runningTaskMapMutex.Unlock()
	return nil
}

//
// start a thread that listens for RPCs from worker.go
//
func (c *Coordinator) server() {
	rpc.Register(c)
	rpc.HandleHTTP()
	//l, e := net.Listen("tcp", ":1234")
	sockname := coordinatorSock()
	os.Remove(sockname)
	l, e := net.Listen("unix", sockname)
	if e != nil {
		log.Fatal("listen error:", e)
	}
	go http.Serve(l, nil)
}

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

//
// main/mrcoordinator.go calls Done() periodically to find out
// if the entire job has finished.
//
func (c *Coordinator) Done() bool {
	// Your code here.
	c.runningTaskMapMutex.Lock()
	done := len(c.RunningTaskMap) == 0 && len(c.MapperTasks) == 0 && len(c.ReducerTasks) == 0
	c.runningTaskMapMutex.Unlock()
	return done
}

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

## rpc.go

```go
package mr

//
// RPC definitions.
//
// remember to capitalize all names.
//

import (
	"os"
	"strconv"
)

// Add your RPC definitions here.
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

// Cook up a unique-ish UNIX-domain socket name
// in /var/tmp, for the coordinator.
// Can't use the current directory since
// Athena AFS doesn't support UNIX-domain sockets.
func coordinatorSock() string {
	s := "/var/tmp/824-mr-"
	s += strconv.Itoa(os.Getuid())
	return s
}
```

## worker.go

```go
package mr

import (
	"encoding/json"
	"fmt"
	"hash/fnv"
	"io/ioutil"
	"log"
	"net/rpc"
	"os"
	"strings"
	"time"
)

//
// Map functions return a slice of KeyValue.
//
type KeyValue struct {
	Key   string
	Value string
}

//
// use ihash(key) % NReduce to choose the reduce
// task number for each KeyValue emitted by Map.
//
func ihash(key string) int {
	h := fnv.New32a()
	h.Write([]byte(key))
	return int(h.Sum32() & 0x7fffffff)
}

// ReadFileContent 读取文件内容
func ReadFileContent(filename string) ([]byte, error) {
	//打开文件
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	//读取文件的内容
	info, err := file.Stat()
	if err != nil {
		return nil, err
	}
	buf := make([]byte, info.Size())
	file.Read(buf)
	return buf, nil
}

func ProcessMapperTask(mapf func(string, string) []KeyValue,
	mapperTask *MrTask) error {
	//
	// read each input file,
	// pass it to Map,
	// accumulate the intermediate Map output.
	//
	intermediate := []KeyValue{}
	for _, inputFilename := range mapperTask.MapperInputFilenames {
		buf, err := ReadFileContent(inputFilename)
		if err != nil {
			log.Printf("ERROR: %s", err)
			return err
		}
		kva := mapf(inputFilename, string(buf))
		intermediate = append(intermediate, kva...)
	}

	intermediateMatrix := make([][]KeyValue, mapperTask.ReducerNumber)
	for _, kv := range intermediate {
		idx := ihash(kv.Key) % mapperTask.ReducerNumber
		intermediateMatrix[idx] = append(intermediateMatrix[idx], kv)
	}

	for reducerId := 0; reducerId < mapperTask.ReducerNumber; reducerId++ {
		intermediateFileName := fmt.Sprintf("mr-%d-%d", mapperTask.Id, reducerId)
		file, err := os.Create(intermediateFileName)
		defer file.Close()
		if err != nil {
			log.Printf("ERROR: %s", err)
			return err
		}

		data, _ := json.Marshal(intermediateMatrix[reducerId])
		_, err = file.Write(data)
		if err != nil {
			log.Printf("ERROR: %s", err)
			return err
		}
	}
	return nil
}

func ProcessReducerTask(reducef func(string, []string) string,
	reducerTask *MrTask) error {
	kvsReduce := make(map[string][]string)
	for idx := 0; idx < reducerTask.MapperNumber; idx++ {
		filename := fmt.Sprintf("mr-%d-%d", idx, reducerTask.ReduceTaskId)
		file, err := os.Open(filename)
		defer file.Close()
		if err != nil {
			log.Printf("ERROR: %s", err)
			return err
		}
		content, err := ioutil.ReadAll(file)
		kvs := make([]KeyValue, 0)
		err = json.Unmarshal(content, &kvs)
		for _, kv := range kvs {
			_, ok := kvsReduce[kv.Key]
			if !ok {
				kvsReduce[kv.Key] = make([]string, 0)
			}
			kvsReduce[kv.Key] = append(kvsReduce[kv.Key], kv.Value)
		}
	}
	ReduceResult := make([]string, 0)
	for key, val := range kvsReduce {
		ReduceResult = append(ReduceResult,
			fmt.Sprintf("%v %v\n", key, reducef(key, val)))
	}
	outFileName := fmt.Sprintf("mr-out-%d", reducerTask.ReduceTaskId)
	err := ioutil.WriteFile(outFileName, []byte(strings.Join(ReduceResult, "")), 0644)
	if err != nil {
		log.Printf("ERROR: %s", err)
		return err
	}
	return nil
}

//
// main/mrworker.go calls this function.
//
func Worker(mapf func(string, string) []KeyValue,
	reducef func(string, []string) string) {

	// Your worker implementation here.
	for {
		response, callSuccess := GetTask()
		task := response.Task
		// 联系不上Coordinator也算是成功
		if response.Status == AllDone || !callSuccess {
			return
		}
		if response.Status == Wait {
			time.Sleep(time.Duration(time.Second * 2))
			continue
		}
		if response.Task.TaskType == MapTask {
			ProcessMapperTask(mapf, &task)
		} else {
			ProcessReducerTask(reducef, &task)
		}
		FinishTask(&task)
	}
}

func GetTask() (GetTaskResponse, bool) {
	request := GetTaskRequest{}
	response := GetTaskResponse{}

	// send the RPC request, wait for the reply.
	callSuccess := call("Coordinator.GetTask", &request, &response)
	return response, callSuccess
}

func FinishTask(task *MrTask) {
	request := FinishTaskRequest{TaskId: task.Id}
	response := FinishTaskResponse{}
	call("Coordinator.FinishTask", &request, &response)
}

//
// send an RPC request to the coordinator, wait for the response.
// usually returns true.
// returns false if something goes wrong.
//
func call(rpcname string, args interface{}, reply interface{}) bool {
	// c, err := rpc.DialHTTP("tcp", "127.0.0.1"+":1234")
	sockname := coordinatorSock()
	c, err := rpc.DialHTTP("unix", sockname)
	if err != nil {
		log.Fatal("dialing:", err)
	}
	defer c.Close()

	err = c.Call(rpcname, args, reply)
	if err == nil {
		return true
	}

	fmt.Println(err)
	return false
}

```