var util = require('../../../utils/util.js');

Page({

  data: {
    number: 6,        //输入框个数
    color: true,
    isFocus: true,    //聚焦
    password: true,
    content: "",        //输入的内容
    disabled: true
  },

  //键盘输入时触发事件
  inputcon: function (e) {
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

  confirm: function (e) {
    var that = this
    console.log(that.data.content);
    var content = that.data.content;
    util.tokenReq("wallet/checkPayPass", {pay_pass: content},function (res) {
      if(res.code == 0){
        util.tokenReq("businessdo/walletPay", { pay_pass: content, business_id: e.currentTarget.dataset.id }, function (res) {
          console.log(res)
          if (res.code == 0) {
            wx.showToast({
              title: '发布成功',
            })
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/order/orderMain/orderMain'
              })
            }, 1000)
          } else if (res.code == 600) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: '支付密码错误',
          icon: 'none'
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      bussiness_id: options.business_id
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