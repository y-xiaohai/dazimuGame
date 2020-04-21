var util = require('../../../utils/util.js');

Page({

  data: {
    isShow: true
  },

  onLoad: function (options) {
    var _this = this
    util.tokenReq('index/getHelperList', {}, function (res) {
      if (res.code == 0) {
        _this.setData({
          lists: res.data,
          isShow: false
        })
      }
    })
  },

  //生命周期函数--监听页面显示
  onShow: function () {
  
  },

  //人物详情页
  personDetail: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
  
})