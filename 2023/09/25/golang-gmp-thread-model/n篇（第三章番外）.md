---
title: 如何像计算机科学家那样思考Python篇（第三章番外）
date: 2016-06-07 17:18:39
description: 第三章番外：你好小乌龟！
categories: python从零单排
tags:
- Python
---
# 你好，小乌龟！

在Python中有很多强大的预置模块，我们可以把他们运用到自己的程序中去。他们中的一些可以发送邮件，或者抓取网页。这章中我们将要见到的模块，允许我们创建一只乌龟（？）并且使用它来绘图。

小乌龟很萌，但是这一章的目标是教我们更多关于Python的知识，以及发展属于我们自己的计算思考的方向，或者如何像一个计算机科学家那样思考。本章中用到的Python语句，会在后面的章节进行更深入的讲解。

# 我们的第一个乌龟程序
让我们写一小段Python程序来创建一个新的小乌龟，并且用它来画一个矩形（我们会把代表我们第一个乌龟的变量`alex`，但是我们可以依据[上一章](/2016/06/01/如何像数据科学家那样思考第一章-程序之路)的命名规则把名字改成别的）。

***以下代码只能在Python3中运行***

```Python
import turtle             # 导入模块，让我们可以使用turtle模块
wn = turtle.Screen()      # 创建一个窗口用以显示乌龟
alex = turtle.Turtle()    # 创建一个乌龟，赋值给alex

alex.forward(50)          # 让 alex 前进 50 个单位
alex.left(90)             # 告诉 alex 向左转 90 度
alex.forward(30)          # 前进30个单位，完成矩形的一个直角

wn.mainloop()             # 等待用户关闭窗口
```
当我们使用命令运行程序的时候：

```bash
# 比如上面的代码放在当前目录叫做ex3_turtle.py的文件中，在命令行中输入以下命令
python3 ex3_turtle.py
```
然后我们会看到一个窗口：
![](/media/14652928631774.jpg)
下面我们将会深入理解这个程序

第一行`import turtle`告诉Python载入一个叫做`turtle`的模块。这个模块带给我们两种可以使用的新类型`Turtle`和`Screen`。点标志`turtle.Turtle`意思是说“被定义在turtle模块中的Turtle类型”（记住Python是大小写敏感的，所以模块名字使用的是小写t开头，和类型`Turtle`是不同的）。

然后我们创建并且打开一个叫做screen（或者称为窗口window），并且我们把它赋值给变量`wn`。每一个窗口screen都包含一个`画布canvas`，这是一个在窗口中，可以用来绘制的区域。

第三行中我们创建了一个乌龟。变量`alex`就指代这只乌龟。






***

# 参考代码
* [My Github](https://github.com/guojiex/leetcodeThing/tree/master/pythonExercise)

# 参考文献
* [How to Think Like a Computer Scientist: Learning with Python 2nd Edition](http://openbookproject.net/thinkcs/python/english2e/ch03.html)
* [How to Think Like a Computer Scientist: Learning with Python 3](http://openbookproject.net/thinkcs/python/english3e/hello_little_turtles.html)




