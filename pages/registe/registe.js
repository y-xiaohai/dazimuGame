var util = require('../../utils/util.js');

Page({
  
  data: {
    clues: '获取验证码',
    disable1: true, //默认禁用
    disable2: true,
    color1: false,
    color2: false,
    currentTime: 60
  },

  inputPhone: function (e) {
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
  sendVerifCode: function () {
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
      util.req('Pub/LoginGetVerify',{"login_phone": phone },function(res) {
        if(res.code == 0){
          wx.showToast({
            title: '验证码已发送',
            duration: 1500
          });
        }else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
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
    var inputcode = e.detail.value;
    if(inputcode.length == 4){
      that.setData({
        disable2: false,
        color2: true
      })
    }
    that.setData({
      inputverifcode: e.detail.value
    })
  },

  confReg: function(){
    var that = this
    var phone = that.data.phone;
    var verifCode = that.data.inputverifcode;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res.data);
        var openid = res.data;
        util.req('Pub/LoginByVerify',{'login_phone': phone,'verify': verifCode, 'mini_program_open_id': openid},function (red) {
          console.log(red)
          if (red.code == 0) {
            wx.showToast({
              title: '登录成功',
              duration: 2000
            })
            wx.setStorage({//将数据存储到缓存中
              key: 'token',
              data: red.data.token,
            })
            if(red.data.is_server == 0){
              wx.reLaunch({
                url: '/pages/realName/authentication/authentication',
              })
            } else if (red.data.is_server == 1) {
              wx.switchTab({
                url: '/pages/index/mainNew/mainNew',
              })
            }   
          } else {
            wx.showToast({
              title: red.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    });      
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