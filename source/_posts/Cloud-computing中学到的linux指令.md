---
title: Cloud Computing中学到的Linux指令
date: 2016-04-30 12:01:37
description: 一些从cloud computing课程中学到的Linux指令
categories: Cloud Computing从零单排
tags:
- Cloud Computing
- Linux
---

# 找出两个文件的差异行

常用于给出了标准reference文件，你已经写出了自己的代码并且得到了属于你的答案，想要看看与标准的差别

	cat output output.2 | sort | uniq -u
	
这里output 和 output.2是两个你想要进行比较的文件

***那么问题来了，有两行长一样但是显示是不同的行该怎么办***

用`hexdump`

# 数行数

如何知道一个文件中有多少行多少个字？使用`wc`命令就可以了：

```bash
wc package.json
		21      38     523 package.json
# 输出的三个数字分别代表 行数、字数、字符数
```


