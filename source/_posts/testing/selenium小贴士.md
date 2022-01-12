---
title: selenium小贴士
date: 2022-01-12 10:14:44
description: 对Vue页面，一些前端自动化测试的小技巧。
categories: 测试之道
tags: 
- Testing
- Selenium
- Vue
---

# Vue

Vue写的应用，页面上经常会有“伪元素”（有好几个几乎一模一样的页面元素,但是只有实际显示的那一个才是我们需要定位的），那么我们要如何定位我们需要的那一个元素呢？

## 定位非隐藏元素

```xpath
not(contains(@style,"display: none"))
```

## 定位包含字符串的元素

```xpath
contains(text(), "你想要定位的元素包含的文本")
```

## 取text()拿不到字符串的元素

```python
web_element.get_attribute('value')
```

## 元素文本包含乱七八糟换行符的元素

```python
web_element.get_attribute('textContent').strip().replace(' ','').replace('\n','')
```