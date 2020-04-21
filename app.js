var util = require('utils/util.js'); 

App({
  onLaunch: function () {
    console.log("app.js的onLaunch")
    var _this = this;
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              confirmColor: '#91D5AD',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '新版本下载失败',
              content: '，请您删除当前小程序，重新搜索打开',
              showCancel: false
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    _this.login();
    
    // this.globalData.mainWind = true;
  },
  // bindTel: function () {
  //   wx.redirectTo({
  //     url: '/pages/registe/registe',
  //   })
  // },
  
  login: function () {
    var that = this;
    wx.login({
      success: function (res) {
        util.req('Pub/loginByOpenId', { 'code': res.code }, function (openret) {
          var openId = openret.data.openid;
          that.globalData.openid = openId;
          wx.setStorage({
            key: "openid",
            data: openId
          })
          if (openret.code == "0") {
            var token = openret.data.token;
            that.globalData.token = token;
            wx.setStorage({
              key: "token",
              data: token
            })  
          } 
          // else {
          //   that.bindTel();//到注册页面
          // }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  globalData: {
    token: null,
    openid: null,
    domain: 'https://weixin.zomin.cn/',
    domainApi: 'https://weixin.zomin.cn/index/',
    mainWind: null
  }
})