---
title: appium初识
date: 2024-11-16 20:24:44
description: 从零开始学习appium控制手机自动化。
categories: 测试之道
tags: 
- Testing
- Selenium
- Vue
---

# [appium](https://appium.io/docs/zh/latest/)

Appium是一个开源项目和相关软件生态系统，旨在促进许多应用程序平台的UI自动化，包括移动端（iOS、Android、Tizen）、浏览器端（Chrome、Firefox、Safari）、桌面端（macOS、Windows）、电视端（Roku、tvOS、Android TV、三星）等！

# [quick start!](https://appium.io/docs/zh/latest/quickstart/)

## [安装 Appium](https://appium.io/docs/zh/latest/quickstart/install/)

```bash
npm i -g appium
```

安装完成后，您应该可以从命令行运行 Appium：

```bash
appium
```

## [安装 UiAutomator2 驱动](https://appium.io/docs/zh/latest/quickstart/uiauto2-driver/)

```bash
appium driver install uiautomator2
```

![UiAutomator2 install success](UiAutomator2_install.png)

## 链接安卓手机

直接安装[android studio](https://developer.android.com/studio?hl=zh-cn)

之后需要在android studio内部安装[Android SDK 平台工具](https://developer.android.com/tools/releases/platform-tools?hl=zh-cn)

或者直接使用homebrew

```bash
brew install --cask android-platform-tools
```

### 链接模拟器

直接使用android studio的 AVD 创建向导创建即可。

### 链接真机

用usb链接手机并且设置usb调试打开之后

### 验证链接成功

在命令行中执行以下命令

```bash
adb devices
```

看到有手机显示就代表连接成功

![adb success](adb_success.png)

## [Python start!](https://appium.io/docs/zh/latest/quickstart/test-py/)


先安装appium python client

```bash
pip install Appium-Python-Client
```

### Battery test!

```python3
import unittest

from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy

capabilities = dict(
    platformName='Android',
    automationName='uiautomator2',
    deviceName='Android',
    appPackage='com.android.settings',
    appActivity='.Settings',
    language='en',
    locale='US'
)

appium_server_url = 'http://localhost:4723'

class TestAppium(unittest.TestCase):
    def setUp(self) -> None:
        self.driver = webdriver.Remote(appium_server_url, options=UiAutomator2Options().load_capabilities(capabilities))

    def tearDown(self) -> None:
        if self.driver:
            self.driver.quit()

    def test_find_battery(self) -> None:
        el = self.driver.find_element(by=AppiumBy.XPATH, value='//*[@text="Battery"]')
        el.click()

if __name__ == '__main__':
    unittest.main()
```

#### 环境变量设置

然后直接执行battery测试报错

```bash
selenium.common.exceptions.WebDriverException: Message: An unknown server-side error occurred while processing the command. Original error: Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported. Read https://developer.android.com/studio/command-line/variables for more details
```

点击对应链接，查看解决方案将对应环境变量设置进你的系统

```bash
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
```

然后重新启动appium服务器，重新执行测试

### install app

可以执行install_app方法安装apk

```python3
self.driver.install_app('/绝对路径或者相对路径')
```

### remove app

```python3
self.driver.remove_app('com.instagram.android')
```

## 安装ui界面检测

[appium-inspector](https://github.com/appium/appium-inspector/releases)