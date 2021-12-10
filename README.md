# Hive_Future_Curation
A tool for estimating future curation payments in Hive
![ " \"image.png\""](https://images.hive.blog/DQmdnjGe1U4efgmAbSqXruCu9kDB5gDiwHAUPZ1EGLJREtT/image.png) One of the ways to earn passive income in HIVE is the curation. We all know how much income we will have when a post is upvoted. It is declared under the post. But what happens when we upvote a post? How is the earning from the curation estimated?

It was really a difficult task in HIVE. In Steem, there were many documents and resources to calculate this. The most didactic one was [this post](https://steemit.com/utopian-io/@yabapmatt/curation-reward-estimation-tool) by @yabapmatt. Reading the Hive whitepaper, I realized that things are a bit changed here. At the very end of my research, I was able to make this simple program to estimate the future curation rewards in Hive.

## **WAS - IS**
* In Steemit, curation rewards was %25 of total payout, 
in HIVE it is %50
This means, curation is much more feasible in HIVE.
* In Steemit, the voting window was 30 minutes for a post,
in HIVE it is:
%80 of curation goes to author if upvoted before 1 minutes
%60 of curation goes to author if upvoted before 2 minutes
%40 of curation goes to author if upvoted before 3 minutes
%20 of curation goes to author if upvoted before 4 minutes
All curation goes to voter if upvoted after 5 minutes.

## **Basic Flow**
With these in hand, we can start the calculation.
The method is as below:
1- get the name of upvoter to the post
2- get the last 1000 activity of the voter
3- get the upvotes from the last 1000 activity
4- calculate the upvote reward ratio with below formula:
(sqrt(total weight of votes before voter+weight of voters vote)-sqrt(weight of votes before voter))/sqrt(weight of total votes)
Here I am not %100 sure...
When I check the reward fund, I see below data:

![image.png](https://images.hive.blog/DQmQ7KyF1KtVfUA24SUZSLee2BgCVREm7Ht6b4iLrUBfSyZ/image.png)
curation reward curve:linear
So my anicent Steemit "sqrt" formula can be false, I may need to change it to linear.
I would really appreciate comments on this!
5- Check the efficiency of voters curation on all posts
6- Send the report with a mention to the voter.
## **How this works**
Just upvote this post and the server will post a comment under this post,with all your estimated curation future earnings as your name is mentioned.
