Page({

  onTap: function () {
    // wx.navigateTo({
    //     url:"../posts/post"
    // });//保留当前页面，跳转到应用内的某个页面
    // wx.redirectTo({
    //   url: '../posts/post'
    // });//关闭当前页面，跳转到应用内的某个页面。
   
    wx.switchTab({
      url: "../posts/post"
    });//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

  }

})