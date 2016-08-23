---
title: Step2 Angularjs模板
date: 2016-04-30 16:58:17
categories: angularjs从零单排
description: Angularjs中的视图与模板
tags:
- angularjs
---

## 视图与模板
在angularjs中，视图就是对应数据模型model的html模板，也就意味着一旦数据模型model的数据发生改变，视图也会随之改变（含有数据绑定的部分） 

app/index.html:

```js
<html ng-app="phonecatApp">
<head>
  ...
  <script src="bower_components/angular/angular.js"></script>
  <script src="js/controllers.js"></script>
</head>
<body ng-controller="PhoneListCtrl">
  <ul>
    <li ng-repeat="phone in phones">
      <span>{{phone.name}}</span>
      <p>{{phone.snippet}}</p>
    </li>
  </ul>
</body>
</html>
```

We replaced the hard-coded phone list with the [ngRepeat directive](https://docs.angularjs.org/api/ng/directive/ngRepeat) and two [Angular expressions](https://docs.angularjs.org/guide/expression):


* The ng-repeat="phone in phones" attribute in the *<*li*>* tag is an Angular repeater directive. The repeater tells Angular to create a *<*li*>* element for each phone in the list using the *<*li*>* tag as the template.

* The expressions wrapped in curly braces ({{phone.name}} and {{phone.snippet}}) will be replaced by the value of the expressions.

这里我们使用angularjs的***ngRepeat***语句进行重复的显示： 

* 	ng-repeat="phone in phones”这句话就是说对于phones集合中的每一个phone个体，都会产生一个数据显示，因为是在*<*li*>*标签中写的，所以每一个phone个体都会生成一个对应的Li（列表项）

We have added a new directive, called ng-controller, which attaches a PhoneListCtrl controller to the <body> tag. At this point: 

* The expressions in curly braces ({{phone.name}} and {{phone.snippet}}) denote bindings, which are referring to our application model, which is set up in our PhoneListCtrl controller.

这里我们提到一个新的原语**ng-controller**，这个原语把名为**PhoneListCtrl**的控制器赋给*<*body*>*标签，那么{{phone.name}}的这些表达式都会在这个控制器的作用域下进行运算

![](/media/14627231086908.jpg)


##模型与控制器

数据模型被控制器PhoneListCtrl所创建，控制器其实就是一个构造函数，简单的使用了$scope作为输入参数：
app/js/controllers.js:

```js
var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function ($scope) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});

```
这里我们声明了一个名叫PhoneListCtrl的控制器，而且把它注册在phonecatApp的angularjs模块中。注意我们在*<*html*>*标签中显式声明了ng-app=phonecatApp 作用域scope: 

> ***作用域***是一个共享区域，提供了一个让模板，模型和控制器协同工作的区域。在作用域中的所有变化都是同步的（数据模型的变化即时反映到视图，视图的变化即时反映到数据模型）

## 测试


