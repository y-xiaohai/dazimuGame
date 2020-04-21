var util = require('../../../../utils/util.js');

Page({

  data: {
    is_show: true,
    xzjd: true, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.load();
  },

  load: function () {
    var that = this
    util.tokenReq("wallet/index", {}, function (res) {
      console.log(res.data)
      if(res.code == 0){
        that.setData({
          balance: res.data.cash_balance,
          // alipay_id: res.data.alipay_login_id,
          pay_pass: res.data.is_pay_pass,
          trade_list: res.data.cash_list
        })
      }  
    })
  },

  //是否收起
  isHidd: function(){
    var that = this;
    that.setData({
      is_show: (!that.data.is_show),
    })
    if (that.data.is_show == true) {
      that.setData({
        xzjd: true
      })
    } else {
      that.setData({
        xzjd: false
      })
    }
  },

  //根据是否设置过密码到不同的页面
  setpassword: function () {
    var payPass = this.data.pay_pass;
    if (payPass){ //设置过密码
      wx.navigateTo({
        url: '/pages/my/wallet/updatePassword/updatePassword',
      })
    }else{
      wx.navigateTo({
        url: '/pages/my/wallet/setPassword/setPassword',
      })
    }
  },

  //提现
  showbox: function () {
    var that = this;
    var isPass = that.data.pay_pass;
    var balance = that.data.balance;
    console.log(that.data)
    if(isPass){
      wx.navigateTo({
        url: '/pages/my/wallet/cashOut/cashOut',
      })
    }else{
      wx.showToast({
        title: '请先设置支付密码',
        icon: 'none'
      })
    }
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
    this.load();
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
    wx.showLoading({
      title: '正在刷新',
    })
    this.load();
    util.initData();
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