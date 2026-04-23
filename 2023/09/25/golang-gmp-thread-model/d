---
title: leetcode康复训练 2. Add Two Numbers
date: 2021-03-09 08:51:59
description: Add the two numbers and return the sum as a linked list.
categories: leetcode
tags:
- leetcode
- algorithm
- leetcode康复训练
---

> [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)

# Problem

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

Example 1:

```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

Example 2:

```
Input: l1 = [0], l2 = [0]
Output: [0]
```

Example 3:

```
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

# 题解

就是个竖式加法，注意边界条件即可。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        output_root = None # 输出结果的根结点
        current_output_node = None # 输出列表节点正在处理的节点
        additional_val = 0 # 进位，也可以叫carry
        p = l1 # 经典双指针循环
        q = l2 # 用本地临时变量防止对外部改变
        while p or q:
            if p and q: # 当两个链表的当前节点都不为空
                result = p.val + q.val + additional_val
                p = p.next
                q = q.next
            elif p:
                result = p.val + additional_val
                p = p.next
            elif q:
                result = q.val + additional_val
                q = q.next
            
            additional_val = int((result - (result % 10)) / 10)
            new_node = ListNode(val=result % 10)
            if current_output_node:
                current_output_node.next = new_node
            else:
                output_root = new_node
            current_output_node = new_node

        if additional_val > 0: # 记得退出之前清理进位
            new_node = ListNode(val=additional_val)
            current_output_node.next = new_node
            
        return output_root
```