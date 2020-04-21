var util = require('../../../../utils/util.js');

Page({

  data: {
    disabled: true,
    showpass: false,
    number: 6,        //密码框
    isFocus: false, 
    password: true,
  },
  
  // 生命周期函数--监听页面加载
  onLoad: function () {
    var that = this
    util.tokenReq("wallet/index", {}, function (res) {
      console.log(res.data)
      that.setData({
        balance: res.data.cash_balance,
        pay_pass: res.data.is_pay_pass,
      })
    })
  },

  getBalance: function(e){
    var that = this
    // console.log(e)
    var value = e.currentTarget.dataset.value;
    if(value == "0.00"){
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
    }else{
      that.setData({
        amount: value
      })
      that.setData({
        disabled: false
      })
    } 
  },

  //输入的提现金额
  inputAmount: function (e) {
    var that = this
    var val = e.detail.value
    if (val.length > 0 && val != 0) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
    val = that.procNum(val);
    that.setData({
      amount: val
    })
  },

  procNum: function (value) {
    value = value.replace(/[^\d.]/g, "");
    value = value.replace(/\.{2,}/g, ".");
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
    if (value.indexOf(".") < 0 && value != "") {
      value = parseFloat(value);
    }
    return value;
  },
  
  next: function(){
    var that = this
    var amount = that.data.amount;
    var balance = that.data.balance;
    if (amount>balance){
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
    }else{
      that.setData({
        showpass: true,
        isFocus: true
      })
    }
  },

  tap: function(){
    var that = this
    that.setData({
      isFocus: true
    })
  },

  close: function () {
    var that = this;
    that.setData({
      showpass: false,
      isFocus: false
    })
  },

  isMove: function () { },

  //输入密码
  inputpwd: function (e) {
    var that = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    that.setData({
      pwd: inputValue,
    })
    if (ilen == 6) {
      util.tokenReq("wallet/checkPayPass", {
        pay_pass: inputValue
      },function(res){
        if(res.code == 0){
          util.tokenReq("wallet/tranToWechat", {
            cash_num: that.data.amount,
            pay_pass: inputValue
          }, function (reds) {
            if (reds.code == 0) {
              wx.redirectTo({
                url: '/pages/my/wallet/cashOutSuccess/cashOutSuccess',
              })
              that.setData({
                showpass: false,
                isFocus: false
              })
            }else{
              wx.showToast({
                title: reds.msg,
                icon: 'none', 
              })
            }
          })
        }else{
          wx.showToast({
            title: '密码错误',
            icon: 'none',
          })
          that.setData({
            pwd: ''
          })
        }
      })
    }
  },

  toFindPwd: function(){
    wx.redirectTo({
      url: '../forgetPwd/forgetPwd',
    })
  }
  
})