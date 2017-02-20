var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (event) {
    var postId = event.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId]

    this.setData({
      postData: postData
    })

    var postsCollected = wx.getStorageSync('posts_Collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected);
    }

    if (app.globalData.isplayingMusic_g && app.globalData.isplayingCurrentPostId === postId) {
      this.setData({
        isPlayingMusic: true
      });
    }

    this.onAudioListen();
  },

  onAudioListen: function (event) {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      //监听音乐播放
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.isplayingMusic_g = true;
      app.globalData.isplayingCurrentPostId=that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      //监听音乐暂停
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.isplayingMusic_g = false;
      app.globalData.isplayingCurrentPostId=null;
    });
    wx.onBackgroundAudioStop(function() {
      //监听音乐停止
       that.setData({
        isPlayingMusic: false,
      })
      app.globalData.isplayingMusic_g = false;
      app.globalData.isplayingCurrentPostId=null;
    });
  },
  onCollect: function (event) {
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // this.showModal(postsCollected,postCollected);//调用showModal函数
    this.showToast(postsCollected, postCollected)
  },


  showToast: function (postsCollected, postCollected) {
    //更新文章是否的缓存值值
    wx.setStorageSync('posts_Collected', postsCollected);
    //更新数据绑定
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      icon: "success",
      duration: 800
    })

  },
  // 由于收藏功能不应出现选择框，所以showModal函数会导致用户体验不好
  // showModal: function (postsCollected,postCollected) {
  //   var that=this;
  //   wx.showModal({
  //     title: "收藏",
  //     content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
  //     showCancel: true,
  //     cancelText: "否",
  //     cancelColor: "#ccc",
  //     confirmText: "是",
  //     confirmColor: "#405f80",
  //     success: function (res) {
  //       if (res.confirm) {
  //         //更新文章是否的缓存值值
  //         wx.setStorageSync('posts_Collected', postsCollected);
  //         //更新数据绑定
  //         that.setData({
  //           collected: postCollected
  //         })
  //       }
  //     },
  //   })
  // }

  onShare: function (event) {
    var itemList = ["分享到微信好友", "分享到朋友圈", "分享到QQ好友", "分享到微博"];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: itemList[res.tapIndex],
          content: "目前微信官方暂不支持分享功能！",
          showCancel: true,
          cancelText: "否",
          cancelColor: "#ccc",
          confirmText: "是",
          confirmColor: "#405f80"
        })
      }
    })
  },
  onMusic: function (event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postDataMusic = postsData.postList[currentPostId].music
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })

    } else {
      wx.playBackgroundAudio({
        dataUrl: postDataMusic.url,
        title: postDataMusic.title,
        coverImgUrl: postDataMusic.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }

  }
})