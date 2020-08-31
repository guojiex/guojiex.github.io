---
title: 关于
date: 2016-06-22 10:36:09
---

# 关于我

*目前单身，欢迎西雅图的妹子找我玩。*

本人男，92年生金牛座。
本科就读中山大学信科院，
研究生就读[中山大学—卡内基梅隆大学联合工程学院](http://jie.sysu.edu.cn)，
曾在[匹兹堡谷歌](https://about.google/locations/?region=north-america&office=pittsburgh)工作3年。
现在在[柯克兰谷歌](https://about.google/locations/?region=north-america&office=kirkland)工作。

# 工作经历

## 2016 - 2017

在匹兹堡谷歌负责Ads Crawl(一个大型广告爬虫系统)的内部测试平台迁移。

## 2018 - 2019.5

在匹兹堡谷歌负责[Custom Search Engine](https://developers.google.com/custom-search)系统的自动化测试。包括：
1.  基于[Selenium Web Driver](https://www.selenium.dev/)的前端自动化测试。通过对系统所有的feature建立测试样例，保证系统功能的稳定性和正确性。
2.  从零开始开发，对搜索后端搜索结果的回归测试。
3.  开发从生产环境抽取样本的测试数据生成器。
4.  基于前面所有这些自动化测试的，自动化release。

## 2019.5 至今

在柯克兰谷歌负责Evenflow(超大规模广告日志处理系统)的测试框架，过程中曾经碰到过的问题：

1.  数据访问局部性(Locality of reference)，数据存放和执行命令如果在两个距离较远的数据中心，运行的速度会受很大影响。
2.  Don't trust people, trust code. 某个API的实际执行逻辑和标称的参数不符，花了我很多时间才证明了代码有问题（因为这个API对我们来说是黑盒，我们并不了解它的内部逻辑）。
