var util = require('../../../utils/util.js');

Page({

  data: {
    clues: '获取验证码',
    isDisableA: false, //三个输入框
    isDisableB: true,
    isDisableC: true,
    disable1: true, //两个按钮
    disable2: true,
    color1: false,
    color2: false,
    currentTime: 60
  },

  onLoad: function(options) {
    var that = this;
    console.log(options.phone)
    that.setData({
      old: options.phone//页面传来的旧手机号
    })
  },

  //用户输入的原手机号
  inputOldPhone: function (e) {
    if (e.detail.value.length == 11 ) {
      this.setData({
        isDisableB: false,
      })
    } else {
      this.setData({
        isDisableB: true,
      })
    }
    this.setData({
      inputOld: e.detail.value
    })
  },

  //用户输入的新手机号
  inputNewPhone: function(e) {
    if (e.detail.value.length == 11){
      console.log(this.data.clues)
      var time = parseInt(this.data.clues);
      if(!time){
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
    }else{
      this.setData({
        disable1: true,
        color1: false
      })
    }
    this.setData({
      inputNew: e.detail.value
    })
  },

  //发送验证码
  sendVerifCode: function () {
    var that = this;
    that.setData({
      disable1: true,
      color1: false,
    })
    var clues = that.data.clues;
    var old = that.data.old;
    var inputOld  = that.data.inputOld;
    var inputNew  = that.data.inputNew;
    var currentTime = that.data.currentTime;
    if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(inputOld) || inputOld != old) {
      wx.showToast({
        title: '原手机号不对',
        icon: 'none'
      })
      that.setData({
        disable1: false,
        color1: true
      })
      return
    } else if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(inputNew)){
      wx.showToast({
        title: '新手机格式不对',
        icon: 'none'
      })
      that.setData({
        disable1: false,
        color1: true
      })
      return
    } else {
      util.tokenReq('mine/getNewPhoneVerify', {
        oldPhone: inputOld,
        newPhone: inputNew
      }, function (res) {
        if(res.code == 0){
          wx.showToast({
            title: '验证码已发送',
            duration: 2000
          });
          that.setData({
            isDisableC: false,
          })
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
            }else{
              that.setData({
                disable1: true,
                color1: false
              })
            }
          }, 1000);
        }else if(res.code == 600){
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },

  //获取输入的验证码
  inputCode: function(e) {
    if(e.detail.value.length == 4){
      this.setData({
        disable2: false,
        color2: true
      })
    }else{
      this.setData({
        disable2: true,
        color2: false
      })
    }
    this.setData({
      inputverif: e.detail.value
    })
  },

  confChange: function() {
    var code = this.data.inputverif;
    util.tokenReq("mine/updatePhoneByVerify", {
      newPhone: this.data.inputNew,
      verifyCode: this.data.inputverif
    }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '修改成功！',
        })
        wx.navigateBack({
          delta: 1,
        })
      } else if(res.code == 600) {
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        })
      }
    }) 
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})