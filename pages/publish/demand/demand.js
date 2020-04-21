var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      content: options.cont
    })
  },

  //获得用户输入的详情内容
  hdcontent: function(e){
    this.setData({
      content: e.detail.value
    })
  },

  //点击标签将内容设置进去
  getvalue: function(e){
    //console.log(e.currentTarget.dataset)   // 通过console.log查看数据，获取需要的数据
    var bqcontent = e.currentTarget.dataset.con;
    this.setData({
      content: bqcontent
    })
  },

  //确认添加
  confadd: function(e){
    console.log(e.currentTarget.dataset);
    let putcontent = e.currentTarget.dataset.nrxq  //获取页面数据信息
    var prevPage = util.prevPage(2);  //上一个页面
    if (putcontent != ''){
      prevPage.setData({
        content: putcontent,
      })        //给上级页面的变量赋值
      wx.navigateBack()  //返回上级页面
    }else{
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
    }
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
