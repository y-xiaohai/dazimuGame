
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ts: '昵称长度限制在2-8个字符内'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //获得新的昵称
  getNewNickName: function(e){
    console.log(e.detail.value);
    this.setData({
      newNickName: e.detail.value
    })
  },

  
  // conf: function (e) {
  //   console.log(e.currentTarget.dataset);
  //   let newNickName = e.currentTarget.dataset.nc;  //获取页面数据信息
  //   var prevPage = util.prevPage(2);  //上一个页面
  //   prevPage.setData({
  //     nickname: newNickName,
  //   })        //给上级页面的变量赋值
  //   wx.navigateBack()  //返回上级页面
  // },
  
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