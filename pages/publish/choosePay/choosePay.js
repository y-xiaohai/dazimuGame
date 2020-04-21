var util = require('../../../utils/util.js');

Page({

  data: {
    business_id: '',
    price: '',
    title: '',
    checked: "checked",
    payMethod: "0",//默认为微信支付
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    util.tokenReq("wallet/index", {}, function (res) {
      if(res.code == 0){
        // console.log(res.data)
        that.setData({
          cash_balance: res.data.cash_balance,//钱包余额
          is_pay_pass: res.data.is_pay_pass
        })
      }
    })
    this.setData({
      business_id: options.business_id,
      price: options.price,
      title: options.title
    })
  },

  radioChange(e) {
    console.log('radio发生change事件，值为 ', e.detail.value)
    this.setData({
      payMethod: e.detail.value
    })
  },

  confpay: function (e){
    var that = this
    var bussiness_id = e.currentTarget.dataset.business_id
    //console.log(that.data.payMethod)
    var ispass = that.data.is_pay_pass;
    var cash = that.data.cash_balance;
    var price = that.data.price;
    //console.log(ispass)
    if (that.data.payMethod == 0) {  //使用微信支付
      util.tokenReq("businessdo/getWxpayParam", { business_id: bussiness_id }, function (res) {
        console.log(res)
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package, // 这里千万注意, 前面要加 'prepay_id='
          signType: 'MD5',
          paySign: res.data.paySign,
          success: function (rd) {
            console.log(rd)
            wx.showToast({
              title: '发布成功',
            })
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/order/orderMain/orderMain'
              })
            },1000)
          },
          fail: function (res) {
            console.log('支付失败');
          }
        })
      })
    } else if (that.data.payMethod == 1) { //使用钱包支付
      if(cash >= price){ //余额大于支付的金额
        if (ispass) { //设置过密码
          wx.navigateTo({
            url: '/pages/publish/inputPwd/inputPwd?business_id=' + bussiness_id
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请先设置支付密码',
            confirmText: '好的',
            cancelText: '不了',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/my/wallet/setPassword/setPassword',
                })
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })
        } 
      }else{
        wx.showToast({
          title: '余额不足',
          icon: 'none'
        })
      }
    }
  },

   // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

   //生命周期函数--监听页面显示
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

   // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  
   // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  
  // 用户点击右上角分享
  onShareAppMessage: function () {

  },

  
})