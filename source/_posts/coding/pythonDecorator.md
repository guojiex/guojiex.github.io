---
title: Python 类级和函数级 Decorator
date: 2016-10-28 10:30:45
description: 在工作中遇见的Python装饰器使用，特地记录一下。
categories: python从零单排
tags:
- Python
---

# 装饰器
# 应用场景
一般来说，我们如果想在某些函数前后添加一些log语句，或者像unit test中每一个test之前之后都会自动执行的setUp或者tearDown函数，最笨的办法是手动在每个函数前后添加你要做的操作。但是这样做代码会很臃肿，而且万一忘了在某些函数前后添加语句，会很麻烦。别人看你的代码也会看得一头雾水。这个时候，python的装饰器语法就很有用。

废话少说，接下来我将会写一些代码来展示装饰器用法

# 函数装饰器
```Python
def WithPreAndPostFunction(origin_function):
    def WrappedFunction(cls):
        print('before')
        function = origin_function(cls)
        print('after')
        return function
    return WrappedFunction

def WithAllTestFunctionWrapped(cls):
    for attr_name in dir(cls):
        attr_value = getattr(cls, attr_name)
        if hasattr(attr_value, '__call__') and attr_value.__name__.startswith('test'):
            setattr(cls, attr_name, WithPreAndPostFunction(attr_value))
    return cls
```

# 实用装饰器的类
```Python
@WithAllTestFunctionWrapped
class Base:
    def OriginFunction(self):
        print('origin function')

    @WithPreAndPostFunction
    def OriginFunctionWrapped(self):
        self.OriginFunction()

    def testOriginFunction(self):
        self.OriginFunction()
```

这里的Base基类使用了WithAllTestFunctionWrapped装饰器，也就是这个类的所有以test为方法名开头的方法都被WithPreAndPostFunction方法包装。

OriginFunctionWrapped函数原本并不会被包装，但是他被加上了WithPreAndPostFunction的装饰器，所以也被包装。


# 主程序代码
```Python
if __name__ == '__main__':
    base = Base()
    base.OriginFunction()
    print('===')
    base.OriginFunctionWrapped()
    print('===')
    base.testOriginFunction()
    print('===')
```

```
origin function
===
before
origin function
after
===
before
origin function
after
===
```

# 参考代码
* [My Github](https://github.com/guojiex/leetcodeThing/blob/master/pythonExercise/decorator/base.py)


