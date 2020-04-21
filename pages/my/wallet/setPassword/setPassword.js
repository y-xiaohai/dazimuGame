var util = require('../../../../utils/util.js');
Page({

  data: {
    clues: "请设置帮忙支付密码，用于支付验证",
    number: 6,        //输入框个数
    color: true,
    isFocus: true,    //聚焦
    password: true,
    content: "",        //输入的内容
    disabled: true   //默认确认按钮禁用
  },
  
  //键盘输入时触发事件
  inputcon: function(e) {
    var that = this;
 // console.log(e.detail.value);
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    if (ilen == 6) {
      that.setData({
        disabled: false,
        color: true
      })
    } else {
      that.setData({
        disabled: true,
        color: false
      })
    }
    that.setData({
      content: inputValue,
    })
  },
    
  tap: function() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  confirm: function() {
    var that = this
    console.log(that.data.content);
    var content = that.data.content
    wx.navigateTo({
      url: '../confirmSetPwd/confirmSetPwd?content='+content
    })
  },

   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nbt = options.nbt;
    wx.setNavigationBarTitle({
      title: nbt,
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