---
title: Step 0
date: 2016-04-22 16:31:13
categories: angularjs从零单排
description: 最基础的index html页面
tags:
- angularjs
---

首先是最基础的index页面： 
	app/index.html:
	
```html
	<!doctype html>
	<html lang="en" ng-app>
	<head>
		<meta charset="utf-8">
		<title>My HTML File</title>
		<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
		<link rel="stylesheet" href="css/app.css">
		<script src="bower_components/angular/angular.js"></script>
	</head>
	<body>
	
	<p>Nothing here {{ 'yet' + '!' }} </p>

	</body>
	</html>
```
	
	
注意这个表达式 

	<p>Nothing here {{'yet' + '!'}}</p>


这里两个大括号里面扩住的是 绑定
这个数据绑定表达式的值会被angularjs自动计算，基于当前modal的作用域

	ng-app directive:
	<html ng-app>
	
这里的np-app标示了什么部分要被判断为angularjs应用，放在这里说明整个Html都是，但是也可以放在别的地方，那么相应的部分就是angularjs应用 



