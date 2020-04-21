var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this //指代当前页面对象
    util.gpsReq('pub/getDefaultImage', {}, function (res) {
      console.log(res.data)
      _this.setData({
        defa_list: res.data, 
      })
    })
  },

  checkboxChange: function (e) {
    console.log(e.detail.value);
    var imgurlarr = e.detail.value;
    // var prevPage = util.prevPage(2);  //上一个页面
    // prevPage.setData({
    //   imgUrls: imgurlarr
    // })

    this.setData({
      imgs: imgurlarr
    })
    
  },
  
  confadd: function () {
    var prevPage = util.prevPage(2);  //上一个页面
    var imgUrls = prevPage.data.imgUrls;
    var imgs = this.data.imgs;
    imgUrls.concat(imgs)
    prevPage.setData({
      imgUrls: imgUrls.concat(imgs)
    })
    wx.navigateBack()  //返回上级页面
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})