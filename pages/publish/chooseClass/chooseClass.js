var util = require('../../../utils/util.js');

Page({

   //页面的初始数据
  data: {
    // category: ['临时帮', '跑腿帮', '美食帮', '租赁帮', '技能帮', '维修帮', '杂货帮', '社交帮'],
  },

  returnClass: function(e){
    let category = e.currentTarget.dataset.category
    console.log(category)
    console.log(e.currentTarget.dataset.num)
    var prevPage = util.prevPage(2);
    prevPage.setData({
      className: category,
      classId: e.currentTarget.dataset.num
    })
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.tokenReq("pub/getClass", {}, function (res) {
      if(res.code == "0"){
        console.log(res.data)
        that.setData({
          classList: res.data
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
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