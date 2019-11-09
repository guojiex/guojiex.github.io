---
title: Design Twitter - Medium - OOD
date: 2016-06-25 22:13:38
description: Design a simplified version of Twitter where users can post tweets, follow/unfollow another user and is able to see the 10 most recent tweets in the user's news feed.
categories: leetcode
tags:
- leetcode
- algorithm
- OO design
---
# Problem

Design a simplified version of Twitter where users can post tweets, follow/unfollow another user and is able to see the 10 most recent tweets in the user's news feed. 

Your design should support the following methods:

	1. postTweet(userId, tweetId): Compose a new tweet.
	2. getNewsFeed(userId): Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user herself. Tweets must be ordered from most recent to least recent.
	3. follow(followerId, followeeId): Follower follows a followee.
	4. unfollow(followerId, followeeId): Follower unfollows a followee.
	
example:

```Java
Twitter twitter = new Twitter();

// User 1 posts a new tweet (id = 5).
twitter.postTweet(1, 5);

// User 1's news feed should return a list with 1 tweet id -> [5].
twitter.getNewsFeed(1);

// User 1 follows user 2.
twitter.follow(1, 2);

// User 2 posts a new tweet (id = 6).
twitter.postTweet(2, 6);

// User 1's news feed should return a list with 2 tweet ids -> [6, 5].
// Tweet id 6 should precede tweet id 5 because it is posted after tweet id 5.
twitter.getNewsFeed(1);

// User 1 unfollows user 2.
twitter.unfollow(1, 2);

// User 1's news feed should return a list with 1 tweet id -> [5],
// since user 1 is no longer following user 2.
twitter.getNewsFeed(1);
```

Original code:

```Java
public class Twitter {

    /** Initialize your data structure here. */
    public Twitter() {
        
    }
    
    /** Compose a new tweet. */
    public void postTweet(int userId, int tweetId) {
        
    }
    
    /** Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user herself. Tweets must be ordered from most recent to least recent. */
    public List<Integer> getNewsFeed(int userId) {
        
    }
    
    /** Follower follows a followee. If the operation is invalid, it should be a no-op. */
    public void follow(int followerId, int followeeId) {
        
    }
    
    /** Follower unfollows a followee. If the operation is invalid, it should be a no-op. */
    public void unfollow(int followerId, int followeeId) {
        
    }
}
/**
 * Your Twitter object will be instantiated and called as such:
 * Twitter obj = new Twitter();
 * obj.postTweet(userId,tweetId);
 * List<Integer> param_2 = obj.getNewsFeed(userId);
 * obj.follow(followerId,followeeId);
 * obj.unfollow(followerId,followeeId);
 */
```

# 分析

首先，观察题目，我们可以看到有Twitter这个比较大的系统，应该独立成为一个类，然后我们想想，可以和Twitter互动的东西是什么？我首先想到的就是User，一个Twitter系统，其实就是用户的管理系统。再继续我们还能看到有Tweet，但是这个Tweet应该被User持有。

# 实战

## User接口
因为Twitter的接口都已经定义好了，所以我们就来先设计用户类。为了方便扩展和隐藏实现细节，我们首先设计一下User接口

```Java
interface User {
        public void postTweet(Tweet tweet);
        public int getUserId();
        public List<User> getFollowed();
        public void follow(User followed);
        public void unfollow(User followed);
        public List<Tweet> getTweets();
    }
```

可以看到，接口中的很多方法都是参照Twitter类的方法进行设计的。设计好了接口，我们就可以实现这个接口。

## User实现类

为了方便，这个UserImpl里面我们使用list来存储followee和这个User发过的Tweet。如果想要更换实现类中使用的数据结构，只需要重新写一个实现类并且把Twitter类中调用UserImpl构造函数的部分更换成新的实现类即可。


```Java
private static class UserImpl implements User {
        private List<User> followedList = new ArrayList<>();
        private List<Tweet> tweetList = new ArrayList<>();
        private int userId;

        /*
         * (non-Javadoc)
         * @see java.lang.Object#hashCode()
         */
        @Override
        public int hashCode() {
            final int prime = 31;
            int result = 1;
            result = prime * result + userId;
            return result;
        }

        /*
         * (non-Javadoc)
         * @see java.lang.Object#equals(java.lang.Object)
         */
        @Override
        public boolean equals(Object obj) {
            if (this == obj)
                return true;
            if (obj == null)
                return false;
            if (getClass() != obj.getClass())
                return false;
            UserImpl other = (UserImpl) obj;
            if (userId != other.userId)
                return false;
            return true;
        }

        public UserImpl(int userId) {
            this.userId = userId;
        }

        @Override
        public void postTweet(Tweet tweet) {
            this.tweetList.add(tweet);
        }

        @Override
        public int getUserId() {
            return this.userId;
        }

        @Override
        public List<User> getFollowed() {
            return new ArrayList<>(this.followedList);
        }

        @Override
        public void unfollow(User followed) {
            if (this.followedList.contains(followed)) {
                this.followedList.remove(followed);
            }
        }

        @Override
        public void follow(User follower) {
            if (!this.equals(follower) && !this.followedList.contains(follower)) {
                this.followedList.add(follower);
            }
        }

        @Override
        public List<Tweet> getTweets() {
            return new ArrayList<>(this.tweetList);
        }
    }
```

## Tweet 内部类
在这里我们需要一个Tweet类来持有用户发送过的Tweet信息，其中我们使用一个timestamp时间戳来保持Tweet的时间顺序

```Java
private static class Tweet implements Comparable<Tweet> {
        private int tweetId;
        private int timestamp;

        public Tweet(int tweetId, int timestamp) {
            super();
            this.tweetId = tweetId;
            this.timestamp = timestamp;
        }

        protected int getTweetId() {
            return tweetId;
        }

        @Override
        public int compareTo(Tweet o) {
            return o.timestamp - this.timestamp;
        }
    }
```

## Twitter实现类


```Java
public class Twitter {
    private Map<Integer, User> userMap = new HashMap<>();
    private int timestamp = 0;

    /** Initialize your data structure here. */
    public Twitter() {
        userMap.clear();
        this.timestamp = 0;
    }

    /** Compose a new tweet. */
    public void postTweet(int userId, int tweetId) {
        if (!this.userMap.containsKey(userId)) {
            User user = new UserImpl(userId);
            this.userMap.put(userId, user);
        }
        this.userMap.get(userId).postTweet(new Tweet(tweetId, timestamp++));
    }

    /**
     * Retrieve the 10 most recent tweet ids in the user's news feed. Each item
     * in the news feed must be posted by users who the user followed or by the
     * user herself. Tweets must be ordered from most recent to least recent.
     */
    public List<Integer> getNewsFeed(int userId) {
        PriorityQueue<Tweet> result = new PriorityQueue<>();
        if (this.userMap.containsKey(userId)) {
            User user = this.userMap.get(userId);
            result.addAll(user.getTweets());
            List<User> followers = user.getFollowed();
            followers.stream().forEach(follower -> {
                result.addAll(follower.getTweets());
            });
        }

        List<Integer> toReturn = new ArrayList<>();
        while (toReturn.size() < 10 && !result.isEmpty()) {
            toReturn.add(result.poll().getTweetId());
        }
        return toReturn;
    }

    /**
     * Follower follows a followee. If the operation is invalid, it should be a
     * no-op.
     */
    public void follow(int followerId, int followeeId) {
        if (!this.userMap.containsKey(followerId)) {
            userMap.put(followerId, new UserImpl(followerId));
        }
        if (!this.userMap.containsKey(followeeId)) {
            userMap.put(followeeId, new UserImpl(followeeId));
        }
        userMap.get(followerId).follow(userMap.get(followeeId));
    }

    /**
     * Follower unfollows a followee. If the operation is invalid, it should be
     * a no-op.
     */
    public void unfollow(int followerId, int followeeId) {
        if (this.userMap.containsKey(followerId)) {
            this.userMap.get(followerId).unfollow(this.userMap.get(followeeId));
        }
    }
}
```


