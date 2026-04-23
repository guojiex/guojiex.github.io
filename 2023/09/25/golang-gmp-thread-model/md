---
title: golang GMP线程模型
date: 2023-09-24 17:47:37
description: golang使用GMP线程模型进行线程调度，了解其中的细节能让我们更好的理解程序的运行过程，减少问题。
tags:
- golang
---

# GMP 模型

* G - goroutine. 协程
* M - worker thread, or machine. 工作线程（实际上是绑定的内核线程）
* P - processor, a resource that is required to execute Go code. M must have an associated P to execute Go code, however it can be blocked or in a syscall w/o an associated P. 简单来说就是协程执行的上下文

# 参考资料

* runtime/runtime2.go(定义gmp数据结构)
* [Scalable Go Scheduler Design Doc](https://golang.org/s/go11sched)
* [工作窃取算法 Work-Stealing](https://developer.aliyun.com/article/946869)
* [Scheduling Multithreaded Computations
by Work Stealing](http://supertech.csail.mit.edu/papers/steal.pdf)
* https://learnku.com/articles/41728
* https://www.oo2ee.com/?p=375
* https://alanzhan.dev/post/2022-01-24-golang-goroutine/