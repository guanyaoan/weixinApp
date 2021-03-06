var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var url = app.globalData.doubanapi + "/v2/movie/subject/" + movieId;
    util.http(url, this.processDouban);

  },
  processDouban: function (data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    };
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      starts: util.coverToStartArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.getCastsData(data.casts),
      castsInfo: util.getCastsInfo(data.casts),
      summary: data.summary
    }
    // console.log(movie);
    this.setData({
      movie: movie
    });
  },
  //查看图片
  onMovieImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],//需要预览的图片httpl链接列表

    })
  }
})