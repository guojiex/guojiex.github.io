---
title: 1. Two Sum
date: 2019-10-29 22:34:37
description: Given an array of integers, return indices of the two numbers such that they add up to a specific target.
categories: leetcode
tags:
- leetcode
- algorithm
---
> [Two Sum](https://leetcode.com/problems/two-sum/)

# Problem

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:

```
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```

# 解法

首先肯定是要遍历整个数组，遍历每一个元素的时候，必须使用某一种数据结构记录下当前已经遍历过的元素，这种数据结构必须是查询方便的，自然是map/hashmap。

然后考虑具体要存放什么，我们要找的是和target相差num[i]的元素，自然key应该设置成target-num[i],value则存放当前元素的index，方便最后输出。

## Solution

```c++
#include <vector>
#include <map>
#include <iostream>
#include <string>
#include <sstream>

using std::cin;
using std::cout;
using std::endl;
using std::getline;
using std::map;
using std::string;
using std::stringstream;
using std::to_string;
using std::vector;

class Solution
{
public:
    vector<int> twoSum(vector<int> &nums, int target)
    {
        map<int, int> remainval_index_map;
        vector<int> result;
        for (int i = 0; i < nums.size(); i++)
        {
            if (remainval_index_map.find(nums[i]) != remainval_index_map.end())
            {
                result.push_back(remainval_index_map[nums[i]]);
                result.push_back(i);
                break;
            }
            remainval_index_map[target - nums[i]] = i;
        }
        return result;
    }
};
```


