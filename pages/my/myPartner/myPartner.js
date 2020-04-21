var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['我的伙伴','我的邀请'],
    currentTab: 0,
  },

  // 导航切换监听
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    util.tokenReq("mine/myFriend", {}, function (res) {
      // console.log(res)
      if (res.code == '0') {
        //把两个数组合并成一个数组
        var leftArr = res.data.friendList.left
        var rightArr = res.data.friendList.right
        var newArr = leftArr.concat(rightArr)
        // console.log(newArr)
        //放入缓存中
        wx.setStorage({
          key: 'newArr',
          data: newArr
        })

        _this.setData({
          leftLists: leftArr,
          rightLists: rightArr,
          myLeftLists: res.data.myList.left,
          myRightLists: res.data.myList.right,
          usersInfo: res.data.usersInfo
        })
        
      }
    })
  },

  //到团队数据页面
  toPartnerDetail: function(e){
    console.log(e)
    let getnum = e.currentTarget.dataset.getnum;
    let level = e.currentTarget.dataset.level;
    let name = e.currentTarget.dataset.name;
    let putnum = e.currentTarget.dataset.putnum;
    let remark = e.currentTarget.dataset.remark;
    let uimage = e.currentTarget.dataset.uimage;
    let useid = e.currentTarget.dataset.useid;
    wx.navigateTo({
      url: '/pages/my/partnerDetail/partnerDetail?useid=' + useid + '&uimage=' + uimage + '&getnum=' + getnum + '&level=' + level + '&name=' + name + '&putnum=' + putnum + '&remark=' + remark,
    })
  },

  searchPartner: function(){
    wx.navigateTo({
      url: '/pages/my/searchPartner/searchPartner',
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