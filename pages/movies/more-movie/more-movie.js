// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    navigatorTitle: "",
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;
    this.data.navigatorTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanapi + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanapi + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanapi + "/v2/movie/top250";
        break;

    }
    util.http(dataUrl, this.processDoubanData);
    this.data.requestUrl = dataUrl;
  },
  //电影更多页面往下拉会加载更多数据
  onReachBottom: function (event) {

    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading(); //加载数据时候出现loading动画
  },
  //顶部下拉重新加载数据
  onPullDownRefresh:function(event){
    var refreshUrl=this.data.requestUrl+"?start=0&count=20";
    this.data.movies={};
    this.data.isEmpty=true;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();

  },
  //加载豆瓣数据
  processDoubanData: function (moviedouban) {
    var movies = [];
    for (var idx in moviedouban.subjects) {
      var subject = moviedouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        starts: util.coverToStartArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var totalMovies = {};
    this.data.totalCount += 20;
    //如果要绑定新加载的数据，那么需要和旧的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    wx.hideNavigationBarLoading();//加载完数据后隐藏loading动画
    wx.stopPullDownRefresh();
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigatorTitle,
    });
  },
   onMovieDetail:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
          url: '../movie-detail/movie-detail?id='+movieId
        })
    }
})