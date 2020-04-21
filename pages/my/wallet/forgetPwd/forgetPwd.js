var util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clues: '获取验证码',
    disable1: true, //默认禁用
    disable2: true,
    color1: false,
    color2: false,
    currentTime: 60
  },

  inputPhone: function(e){
    var that = this;
    var inputNum = e.detail.value;
    var numLen = inputNum.length;
    if (numLen == 11) {
      var time = parseInt(this.data.clues);
      if (!time) {
        this.setData({
          disable1: false,
          color1: true
        })
      } else {
        this.setData({
          disable1: true,
          color1: false
        })
      }
    } else {
      that.setData({
        disable1: true,
        color1: false
      })
    }
    that.setData({
      phone: inputNum,
    }) 
  },

  //发送验证码
  sendVerifCode: function(){
    var that = this;
    that.setData({
      disable1: true,
      color1: false,
    })
    var phone = that.data.phone;
    var clues = that.data.clues;
    var currentTime = that.data.currentTime;
    if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号不合法',
        icon: 'none'
      })
      that.setData({
        disable1: false,
        color1: true
      })
    } else {
      util.tokenReq('wallet/getVerifyOnForgetPayPass', {"login_phone": phone}, function (res) {
        if(res.code == 0){
          wx.showToast({
            title: '验证码已发送',
            duration: 2000
          });
        } else if (res.msg == '手机号输入有误' ){
          wx.showToast({
            title: '不是绑定的手机号',
            icon: 'none',
            duration: 2000
          });
        } else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          });
        }
        
        //计时器
        var interval = setInterval(function () {
          currentTime--; //每执行一次让倒计时秒数减一
          that.setData({
            clues: currentTime + 's后获取', //按钮文字变成倒计时对应秒数
          })
          if (currentTime <= 0) {  //如果当秒数小于等于0时
            clearInterval(interval) //停止计时器
            that.setData({
              clues: '获取验证码',
              currentTime: 60,
              disable1: false,
              color1: true
            })
          } else {
            that.setData({
              disable1: true,
              color1: false
            })
          }
        }, 1000);
      })
    }
  },
  //输入的验证码
  inputCode: function (e) {
    var that = this;
    console.log(that.data.againPassword)
    that.setData({
      inputverifcode: e.detail.value
    })
    that.check();
  },
  //输入的新密码
  inputPwd: function (e) {
    var that = this;
    that.setData({
      password: e.detail.value
    })
    that.check();
  },
  //第二次输入的密码
  againPwd: function (e) {
    var that = this;
    that.setData({
      againPassword: e.detail.value
    })
    that.check();
  },

  check: function(){
    var that = this;
    var phone = that.data.phone +'';
    var code = that.data.inputverifcode +'';
    var pwd = that.data.password + '';
    var agpwd = that.data.againPassword + '';
    if (phone.trim().length == 11 && code.trim().length == 4 && pwd.trim().length == 6 && pwd == agpwd && pwd.trim() != 'undefined' && agpwd.trim() != 'undefined' ) {
      that.setData({
        disable2: false,
        color2: true,
      })
    }else{
      that.setData({
        disable2: true,
        color2: false,
      })
    }
  },

  confChange: function(e){
    var that = this;
    util.tokenReq('wallet/setPayPassByVerify', {
      "pay_pass": that.data.againPassword,
      "verify_code": that.data.inputverifcode
    }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '设置成功',
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/my/wallet/myWallet/myWallet',
              })
            }, 1500);
          }
        }) 
      } else if(res.code == 600) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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