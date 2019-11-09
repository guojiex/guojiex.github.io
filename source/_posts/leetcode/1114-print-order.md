---
title: 1114. Print In Order
date: 2019-11-09 10:11:59
description: Print three function result in order, while runnning concurrently.
categories: leetcode
tags:
- leetcode
- algorithm
- concurrency
---
> [Print in Order](https://leetcode.com/problems/print-in-order/)

# Problem

Suppose we have a class:

```c++
public class Foo {
  public void first() { print("first"); }
  public void second() { print("second"); }
  public void third() { print("third"); }
}
```

The same instance of Foo will be passed to three different threads. Thread A will call first(), thread B will call second(), and thread C will call third(). Design a mechanism and modify the program to ensure that second() is executed after first(), and third() is executed after second().

 

## Example 1:

Input: [1,2,3]
Output: "firstsecondthird"
Explanation: There are three threads being fired asynchronously. The input [1,2,3] means thread A calls first(), thread B calls second(), and thread C calls third(). "firstsecondthird" is the correct output.

## Example 2:

Input: [1,3,2]
Output: "firstsecondthird"
Explanation: The input [1,3,2] means thread A calls first(), thread B calls third(), and thread C calls second(). "firstsecondthird" is the correct output.
 

Note:

We do not know how the threads will be scheduled in the operating system, even though the numbers in the input seems to imply the ordering. The input format you see is mainly to ensure our tests' comprehensiveness.

# 题解

题目的意思是，有三个线程同时执行，保证输出的顺序。只需要用连续的锁，保证锁之间的顺序就好了。也可以用c++的promise，future来实现。

```c++
class Foo {
public:
    Foo() {
        std::lock(second_mutex, third_mutex);
    }

    void first(function<void()> printFirst) {
        // printFirst() outputs "first". Do not change or remove this line.
        printFirst();
        second_mutex.unlock();
    }

    void second(function<void()> printSecond) {
        second_mutex.lock();
        // printSecond() outputs "second". Do not change or remove this line.
        printSecond();
        second_mutex.unlock();
        third_mutex.unlock();
    }

    void third(function<void()> printThird) {
        third_mutex.lock();
        // printThird() outputs "third". Do not change or remove this line.
        printThird();
        third_mutex.unlock();
    }
private:
    std::mutex second_mutex;
    std::mutex third_mutex;
};
```