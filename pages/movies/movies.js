var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        Top250: {},
        containerShow: true,
        searchShow: false,
        searchResult:{}
    },
    onLoad: function (event) {
        var inTheaters = app.globalData.doubanapi + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoon = app.globalData.doubanapi + "/v2/movie/coming_soon" + "?start=0&count=3";
        var Top250 = app.globalData.doubanapi + "/v2/movie/top250" + "?start=0&count=3";

        this.getDoubansession(inTheaters, "inTheaters", "正在热映");
        this.getDoubansession(comingSoon, "comingSoon", "即将上映");
        this.getDoubansession(Top250, "Top250", "豆瓣Top250");

    },
    onMore: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category

        })
    },
    getDoubansession: function (url, settedkey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
                "Content-Type": "json"
            },
            success: function (res) {

                that.processDoubanData(res.data, settedkey, categoryTitle);
            },
            fail: function (error) {

            }
        })
    },
    processDoubanData: function (moviedouban, settedkey, categoryTitle) {
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
        var readyData = {};
        readyData[settedkey] = {
            categoryTitle: categoryTitle,
            movies: movies
        };
        this.setData(readyData);
    },
    onfocus: function (event) {
        this.setData({
            containerShow: false,
            searchShow: true
        });
    },
    oncancel: function (event) {
        this.setData({
            containerShow: true,
            searchShow: false,
              searchResult:{}
        });
      
    },
    onconfirm:function(event){
        var text=event.detail.value;
        var searchUrl=app.globalData.doubanapi + "/v2/movie/search?q="+text;
        this.getDoubansession(searchUrl,"searchResult","");
    },
    onMovieDetail:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
          url: 'movie-detail/movie-detail?id='+movieId
        })
    }
})