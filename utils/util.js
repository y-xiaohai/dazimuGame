var rootDocment = 'https://weixin.zomin.cn/index/';

//获取上back_num页
function prevPage(back_num) {
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - back_num];
  return prevPage;
}

// 携带token的请求接口
function tokenReq(url, data, cb) {
  var token = wx.getStorageSync('token')
  if(token == ''){
    setTimeout(function(){
      token = wx.getStorageSync('token')
    },1000);
  }
  data.token = token
  return req(url, data, cb)
}

// 携带token以及经纬度的请求接口
function gpsReq(url, data, cb) {
  var token = wx.getStorageSync('token')
  var gps_lon = wx.getStorageSync('gps_lon')
  var gps_lat = wx.getStorageSync('gps_lat')
  if (gps_lon == '' || gps_lat == '') {
    setTimeout(function () {
      gps_lon = wx.getStorageSync('gps_lon')
      gps_lat = wx.getStorageSync('gps_lat')
    }, 1000);
  }
  data.token = token
  data.gps_lon = gps_lon
  data.gps_lat = gps_lat
  data.hx_lon = gps_lon
  data.hx_lat = gps_lat  
  return tokenReq(url, data, cb)
}

//请求的封装方法
function req(url, data, cb) {
  // data.appid = AppConf.appid;
  // data.appsecret = AppConf.appsecret;
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'POST',
    header: {
      'x-app-key': '34889c38e2d2293f94af63b30e4106a7',
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

function getReq(url, data, cb) {
  // data.appid = AppConf.appid;
  // data.appsecret = AppConf.appsecret;
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    header: {
      'x-app-key': '34889c38e2d2293f94af63b30e4106a7',
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

function initData() {
  setTimeout(function () {
    //请求结束
    wx.stopPullDownRefresh();
    wx.hideLoading();
  }, 1000);
}

//获取七牛token
function getQiniuToken(){
  req("Pub/getQiniuToken",{},function(res){
    wx.setStorage({//将数据存储到缓存中
      key: 'qiniuToken',
      data: res.data.qiniu_token,
    })
  })
}

//初始化七牛的方法
function initQiniu() {
  var qiniuUploader = require('qiniuUploader.js');
  var options = {
    region: 'ECN', // 华北区
    uptoken: wx.getStorageSync("qiniuToken"),
    domain: 'http://apppic.zomin.cn/',
    shouldUseQiniuFileName: true
  };
  qiniuUploader.init(options);
}


function didPressChooesImage(that) {
  var qiniuUploader = require('qiniuUploader.js');
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
    count: 3,
    sizeType: ['compressed'],
    success: function (res) {
      console.log(res.tempFilePaths)
      console.log(res)
      var tempFilePaths = res.tempFilePaths;
      for(var i = 0;i<tempFilePaths.length;i++){
        var filePath = res.tempFilePaths[i];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          that.setData({
            'imageObject': res
          });
          var imgUrls = that.data.imgUrls;
          imgUrls.push(that.data.imageObject.imageURL);
          console.log(imgUrls)
          that.setData({ 'imgUrls': imgUrls })
          // return imgUrls;
        }, (error) => {
          // console.error('error: ' + JSON.stringify(error));
        },
          null,// 可以使用上述参数，或者使用 null 作为参数占位符
          (progress) => {
            console.log('上传进度', progress.progress)
            console.log('已经上传的数据长度', progress.totalBytesSent)
            console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
          }, cancelTask => that.setData({ cancelTask })
        );
      }
    }
  })
}

function numberCheck(value){
  var len1 = value.substr(0, 1);
  var len2 = value.substr(1, 1);
  if (value.length > 1 && len1 == 0 && len2 != ".") {
    value = value.substr(1, 1);
  }
  if (len1 == ".") {
    value = "";
  }
  value = value.replace(/[^\d.]/g, "");
  value = value.replace(/\.{2,}/g, ".");
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
  if (value.indexOf(".") < 0 && value != "") {
    value = parseFloat(value);
  }
  return value;
}

function isMobile(str) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  // var myreg = /^1[34578]\d{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//暴露方法
module.exports = {
  prevPage: prevPage,
  tokenReq: tokenReq,
  getReq: getReq,
  req: req,
  gpsReq: gpsReq,
  initQiniu: initQiniu,
  didPressChooesImage: didPressChooesImage,
  getQiniuToken: getQiniuToken,
  initData: initData,
  numberCheck: numberCheck,
  isMobile: isMobile,
  random: random
}