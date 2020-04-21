var util = require('../../../../utils/util.js');

Page({

  data: {
    clues: "请再次输入密码以确认",
    number: 6,        //输入框个数
    isFocus: true,    //聚焦
    superCon: "",  //上个页面的值
    password: true,
    content: "",        //输入的内容
    disabled: true   //确认按钮是否禁用
  },
  
  //键盘输入时触发事件
  inputcon: function(e) {
    var that = this;
 // console.log(e.detail.value);
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    if (ilen == 6) {//6位密码已写完
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
    
  tap:function() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  confirm: function() {
    var that = this
    var content = that.data.content
    if(content == that.data.superCon){//两次输入的相同
      util.tokenReq("wallet/setPayPass", { pay_pass: content}, function (res) {
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
        }
      })
    }else{
      wx.showToast({
        title: '确认密码不正确',
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.content)
    this.setData({
      superCon: options.content
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