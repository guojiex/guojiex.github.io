---
title: Python 类级和函数级 Decorator
date: 2016-10-28 10:30:45
description: 在工作中遇见的Python装饰器使用，特地记录一下。
categories: python从零单排
tags:
- Python
---

# 装饰器
## 应用场景
一般来说，我们如果想在某些函数前后添加一些log语句，或者像unit test中每一个test之前之后都会自动执行的setUp或者tearDown函数，最笨的办法是手动在每个函数前后添加你要做的操作。但是这样做代码会很臃肿，而且万一忘了在某些函数前后添加语句，会很麻烦。别人看你的代码也会看得一头雾水。这个时候，python的装饰器语法就很有用。





# 参考代码
* [My Github](https://github.com/guojiex/leetcodeThing/blob/master/pythonExercise/decorator/base.py)


