---
title: 录制回放AB测试
date: 2022-07-09 21:37:57
description: 谷歌如何在庞大的代码库之上进行迅速迭代？在没有详细业务测试样例的情况下，如何保证每次代码提交都有足够的回归测试？一切都在录制回放AB测试
categories: 测试之道
tags: 
- Testing
---

# AB Test

控制变量法，同样的输入，经过不同版本的代码运行，得到不同的结果。结果之间的差异就代表了这两个不同版本代码的差异，这就是对代码的AB Test

业界对这种做法的一个开源实现是twitter的[Diffy](https://github.com/opendiffy/diffy)

![diffy system design](diffy.jpeg)

Diffy会把你的输入复制并发送给三个服务。其中primary和secondry应该部署相同的，已知是好的代码版本，作为基线。candidate就是你想要发布/测试的新版本代码。通过对primary和secondry的结果对比，找到响应中和代码无关的噪音，在和candidate对比的时候去除这些噪音，就可以得到代码的真实差距。

## AB Test的优点

* 原理简单
* 不需要深入理解代码实现，不需要