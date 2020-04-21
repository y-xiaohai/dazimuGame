var util = require('../../../utils/util.js');

Page({

  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //console.log(options);
    wx.setNavigationBarTitle({
      title: '我的伙伴' + '-' + options.name
    })
    _this.setData({
      item: options
    })
    
    util.tokenReq("mine/getFriendsTeam", {friendUsersId: options.useid}, function (res) {
      console.log(res)
      if (res.code == '0') {
        _this.setData({
          parentName: res.data.parentName,
          lists: res.data.list
        })
      }
    })
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