---
title: 关于
date: 2016-06-22 10:36:09
---

# 关于我

*目前单身，欢迎深圳的妹子找我玩。*

本人男，92年生金牛座。
*   本科就读中山大学信科院信息安全，
*   研究生就读[中山大学—卡内基梅隆大学联合工程学院](http://jie.sysu.edu.cn)，
*   曾在[匹兹堡谷歌](https://about.google/locations/?region=north-america&office=pittsburgh)工作3年。
*   曾在[柯克兰谷歌](https://about.google/locations/?region=north-america&office=kirkland)工作2年。
*   现在在深圳工作。

# 工作经历

## 2022.2 - 至今

*   shopee深圳

## 2021.5 - 2022.1

*   在新心数科负责联邦学习平台的测试开发
    *    领导搭建前端selenium driver浏览器自动化测试
    *    完善开发测试全流程规范
    *    整合Gitlab CI/CD流程
    *    部署allure测试报告服务器
    *    全平台k8s化部署
    *    运维管理配置中心开发（beego）

## 2019.5 - 2021.4

在柯克兰谷歌负责Evenflow(超大规模广告日志处理系统)的测试框架

*   独立设计开发验证了一个在线测试依赖平台的本地实现
    *   通过把在线平台替换为本地实现，帮助测试稳定性从75%提高到95% 
    *   测试运行时间平均降低30%(2400秒 - 1600秒) 
*   开发了一个计时报告库以及计时报告面板dashboard，跟踪测试各个阶段耗时与预警

1.  数据访问局部性(Locality of reference)，数据存放和执行命令如果在两个距离较远的数据中心，运行的速度会受很大影响。
2.  Don't trust people, trust code. 某个API的实际执行逻辑和标称的参数不符，花了我很多时间才证明了代码有问题（因为这个API对我们来说是黑盒，我们并不了解它的内部逻辑）。

## 2018 - 2019.5

在匹兹堡谷歌负责[Custom Search Engine](https://developers.google.com/custom-search)系统的自动化测试。包括：
*   搜索后端回归测试
    *   独立设计测试，搭建测试环境，持续集成
    *   开发测试专用缓存层，减少外部依赖导致的不稳定结果
    *   设计实现生产环境请求采集器，搜集请求用于重放测试
*   前端测试
    *   基于[Selenium Web Driver](https://www.selenium.dev/)的前端自动化测试。通过对系统所有的feature建立测试样例，保证系统功能的稳定性和正确性。
    *   前端截图回归测试
*   基于所有这些自动化测试的完备与稳定性，持续集成，自动release，持续部署
*   [Custom Search Engine Flutter 演示app](https://github.com/guojiex/flutter_app_cse)
    *   为访问搜索API实现的按时间失效缓存[Expire Cache in dart](https://github.com/guojiex/expire_cache) 

## 2016 - 2017

在匹兹堡谷歌负责Ads Crawl(一个大型广告爬虫系统)的内部测试平台迁移。
