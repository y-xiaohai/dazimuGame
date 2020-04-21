var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "phone": "", //手机号
    "is_left": "1", //分区
    "items": [{ name: "左区", value: "1" ,checked: "checked"}, { name: "右区", value: "0" }], //分区选项
    disabled: true,
    color: false,
    showDialog1: false,//弹窗是否显示
    text1: '',
    text2: '',
    text3: ''
  },

  //点击获取焦点
  chooseNum: function (e) {
    this.setData({
      focus: true
    })
  },

  //获取手机号
  handleLoginPhone: function (e) {
    var that = this;
    var num = e.detail.value;
    if(num.length == 11){
      that.setData({
        disabled: false,
        color: true
      })
    }else{
      that.setData({
        disabled: true,
        color: false
      })
    }
    that.setData({
      phone: e.detail.value
    })
  },

  //选择左右区
  radioChange(e) {
    console.log('radio发生change事件，值为 ', e.detail.value)
    this.setData({
      is_left: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //设置下级
  setChild: function(){
    var _this = this;
    util.tokenReq("mine/addChildren", {
      login_phone: _this.data.phone,
      is_left: _this.data.is_left
    },function(req){
      if(req.code == 0){
        wx.showModal({
          title: '',
          content: '恭喜您成功获得一枚大将',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#91D5AD'
        })
      }else if(req.code == 600){
        if (req.msg == '您还没被进入系统'){
          _this.setData({
            showDialog1: true,
            text1: '需要找到帮忙系统',
            text2: '的伙伴邀请您后',
            text3: '才能组建您的团队'
          })
        }else{
          wx.showToast({
            title: req.msg,
            icon:"none"
          })
        }
      }
    })
  },
  
  close:function(){
    var that = this
    that.setData({
      showDialog1: false, 
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