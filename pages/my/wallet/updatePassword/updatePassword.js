var util = require('../../../../utils/util.js');

Page({

  data: {
    clues: "请输入原支付密码以验证身份",
    number: 6,        //输入框个数
    isFocus: true,    //聚焦
    password: true,
    content: "",        //输入的内容
    disabled: true   //默认确认按钮禁用
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
      })
    } else {
      that.setData({
        disabled: true,
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


  confirm: function () {
    var that = this
    //console.log(that.data.content);
    var content = that.data.content
    util.tokenReq("wallet/checkPayPass",{pay_pass: content},function (res) {
      console.log(res)
      if(res.code == 0){//原密码正确就到设置密码页面
        var nbt = '修改支付密码'
        wx.navigateTo({
          url: '../setPassword/setPassword?nbt='+nbt
        })
      }else if(res.code == 600){
        wx.showToast({
          title: '原支付密码错误',
        })
      }
    })
     
  },

  //忘记密码跳转到用手机号验证码修改页面
  forget: function () {
    wx.navigateTo({
      url: '../forgetPwd/forgetPwd',
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