var util = require('../../../utils/util.js');
var isTap = true;

Page({

  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    util.tokenReq('server/serverInfo', {}, function (res) {
      if(res.code == '0'){
        that.setData({
          linkname: res.data.real_name,
          sex: res.data.sex,
          linkphone: res.data.login_phone,
        })
      }
    })
  },

  //点击获取焦点
  getFocusA: function () {
    this.setData({
      focusA: true
    })
  },
  getFocusB: function () {
    this.setData({
      focusB: true
    })
  },
  getFocusC: function () {
    this.setData({
      focusC: true
    })
  },

  inputName: function (e) {
    this.setData({
      linkname: e.detail.value
    })
  },

  inputPhone: function (e) {
    this.setData({
      linkphone: e.detail.value
    })
  },
  
  inputDetail: function (e) {
    this.setData({
      linkdetail: e.detail.value
    })  
  },

  saveAddress: function(e){
    var that = this;
    if (that.data.linkname == undefined || that.data.linkname == ''){
      wx.showToast({
        title: '请填写联系人',
        icon: 'none'
      })
    } else if (that.data.sex == undefined || that.data.sex == '') {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
    } else if (that.data.linkphone == undefined || that.data.linkphone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
    } else if (!util.isMobile(that.data.linkphone)) {
      wx.showToast({
        title: '手机号不合法',
        icon: 'none'
      })
    } else{
      if (isTap) {
        isTap = false;
        util.tokenReq('server/addAddress', {
          city_code: e.currentTarget.dataset.code,
          hx_lon: e.currentTarget.dataset.lon,
          hx_lat: e.currentTarget.dataset.lat,
          name: e.currentTarget.dataset.name,
          address: e.currentTarget.dataset.address,

          house_num: that.data.linkdetail == undefined ? '' : that.data.linkdetail,
          linkman_name: that.data.linkname,
          linkman_phone: that.data.linkphone,
          linkman_sex: that.data.sex
        }, function (req) {
          if (req.code == '0') {
            wx.showToast({
              icon: 'none',
              title: '添加成功',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000);
          }else if(req.code == '600'){
            wx.showToast({
              icon: 'none',
              title: '请选择服务地址',
              duration: 1000
            })
          }
        })
        setTimeout(function () {
          isTap = true;
        }, 2000);
      }
    }  
  },

  chooseSexM: function(){
    this.setData({
      sex: 1
    })
  },
  chooseSexF: function () {
    this.setData({
      sex: 2
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