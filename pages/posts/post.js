var postData=require("../../data/posts-data.js");

Page({
  data: {
    // 小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onload事件执行之后发生的
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    

    this.setData({
      posyKey: postData.postList
    });
  },
  onTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  },
 
  onswiper:function(event){
    //target和currentTarget区别
    // target指的是当前点击的组件，currentTarget指的是事件捕获的组件
    // target这里指image，currentTarget这里指swiper
    var postId=event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  }
})