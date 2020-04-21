var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.tokenReq("server/serverInfo", {}, function (res) {
      if(res.code == 0){
        console.log(res)
        that.setData(res.data);
        if (!res.data.isSetBussiess){
          that.setData({
            isShow: false
          })
        }
        var name = res.data.nickname;
        var cardId = res.data.card_num;
        if(name.length >=2 && name.length<4){
          name = name.substring(0,1)+"**";
        }else if(name.length>=4){
          name = name.substring(0, 2) + "**";
        }
        that.setData({
          nickName: name,
          cardId: cardId.substring(0,4)+"** ******** "+cardId.substring(14)
        })
      }
    })
  },

 //激活账户（即发单）
  activation: function(){
    wx.switchTab({
      url: '/pages/publish/putOrder/putOrder',
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