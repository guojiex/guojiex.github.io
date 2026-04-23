---
title: gorm mysql 报错 driver skip fast-path; continue as if unimplemented
date: 2022-09-13 11:25:08
description: gorm不支持prepare statement时，如何消除报错skip fast-path; continue as if unimplemented？
categories: 工作总结
tags:
- gorm
- mysql
- Prepared Statement
- golang
---

# 背景

目前我们使用v1.9.16的gorm（github.com/jinzhu/gorm v1.9.16），不支持在初始化配置中设置开启[prepared statement](https://gorm.io/docs/performance.html#Caches-Prepared-Statement)。

这样在我们使用sql hook替换默认mysql driver的时候，经常会有报错driver skip fast-path; continue as if unimplemented。

# 解决方案

可以查看[interpolateparams的官方文档](https://github.com/go-sql-driver/mysql#interpolateparams)，只需要在创建数据库连接时，连接dsn中添加interpolateparams=true作为参数。