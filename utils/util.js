function coverToStartArray(starts) {
    var num = starts.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}
function http(url, callBack) {
    wx.request({
        url: url,
        data: {},
        method: 'GET',
        // header: {}, // 设置请求的 header
        header: {
            "Content-Type": "json"
        },
        success: function (res) {
            // success
            callBack(res.data);
        },
        fail: function (error) {
            // fail
            console.log(error);
        }
    })
}
function getCastsData(casts) {
    var castsData = ""
    for (var idx in casts){
        castsData = castsData + casts[idx].name + "/";
    }
    return castsData.substring(0, castsData.length - 2);

}
function getCastsInfo(casts) {
    var castArray = [];
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castArray.push(cast);
    }
    return castArray;
}

module.exports = {
    coverToStartArray: coverToStartArray,
    http: http,
    getCastsData:getCastsData,
    getCastsInfo:getCastsInfo
}