Page({

  data: {
    friendList: []
  },

  onLoad: function () {
    var _this = this;
    wx.getStorage({
      key: 'newArr',
      success: function (re) {
        _this.setData({
          friendList: re.data
        })
      },
    })
    console.log(_this.data)
  },

  handleinput: function(e){
    let _this = this;
    var w = e.detail.value;
    _this.setData({
      keyWord: w.replace(/\s+/g,'')
    })
  },
  
  //点击搜索
  search: function (e) {
    var that = this
    var friendList = that.data.friendList
    if (that.data.keyWord == undefined || that.data.keyWord == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        searchList: []
      })
      return
    }else{
      var entArr = [];
      var word = that.data.keyWord.trim();
      for (var i = 0; i < friendList.length;i++){
        if (word == friendList[i].login_name || 
        that.data.keyWord == friendList[i].login_name.substring(0, 1) || 
        that.data.keyWord == friendList[i].login_name.substring(0, 2) || 
        that.data.keyWord == friendList[i].login_name.substring(1, 2) ||
        that.data.keyWord == friendList[i].login_name.substring(1, 3) ||
        that.data.keyWord == friendList[i].login_name.substring(2, 3) ||
        that.data.keyWord == friendList[i].login_name.substring(0, 2) ||
        that.data.keyWord == (friendList[i].login_name.substring(0, 1) + friendList[i].login_name.substring(2, 3))){
          entArr.push(friendList[i]);
        }
      }
      console.log(entArr);
      that.setData({
        searchList: entArr
      })
    }
  },


  //到团队数据页面
  toPartnerDetail: function (e) {
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