var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // var page = util.prevPage(2);
    // console.log(page.route)
    // this.data.prevPath = page.route//上个页面的路径
    var that = this
    that.setData({
      addressId: options.aId,
      citycode: options.code,
      name: options.name,
      address: options.address,
      hx_lon: options.lon,
      hx_lat: options.lat,
      linkname: options.liname,
      linkphone: options.liphone,
      sex: options.lisex,
    })
    if (options.house != "undefined"){
      that.setData({
        linkdetail: options.house
      })
    }
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

  saveAddress: function(){
    var that = this
    if (that.data.linkname == undefined || that.data.linkname == '') {
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
      util.tokenReq("server/updateAddress", {
        addressId: that.data.addressId,
        city_code: that.data.citycode,
        hx_lon: that.data.hx_lon,
        hx_lat: that.data.hx_lat,
        name: that.data.name,
        address: that.data.address,
        house_num: that.data.linkdetail,

        linkman_name: that.data.linkname,
        linkman_phone: that.data.linkphone,
        linkman_sex: that.data.sex
      }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000
          })
          // if (that.data.prevPath == "pages/publish/putOrder/putOrder") {
          //   setTimeout(function () {
          //     wx.navigateBack({})
          //     wx.showTabBar({})
          //   }, 1500);
          // } else{
            setTimeout(function () {
              wx.navigateBack({})
            }, 1000);
          // }
        }
      })
    }
  },

  delAddress: function(){
    var that = this
    util.tokenReq("server/deleteAddress", {
      addressId: that.data.addressId,
    }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000
        })
        // if (that.data.prevPath == "pages/publish/putOrder/putOrder") {
        //   setTimeout(function () {
        //     wx.navigateBack({})
        //     wx.showTabBar({})
        //   }, 1500);
        // } else {
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000);
        // } 
      }
    })
  },

  chooseSexM: function () {
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