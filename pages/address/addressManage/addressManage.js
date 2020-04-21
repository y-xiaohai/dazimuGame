var util = require('../../../utils/util.js');

var startX;
var startY;

Page({
  
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.load()
    this.setData({
      heig: wx.getSystemInfoSync().windowHeight-49
    })
  },

  load: function(){
    var _this = this;
    util.tokenReq("server/AddressList", {}, function (res) {
      if(res.code == 0){
        _this.setData({
          items: res.data,
        })
      }
    })
  },

  //编辑地址
  editorAddress: function(e){
    var adId = e.currentTarget.dataset.ad;
    var name = e.currentTarget.dataset.name;
    var addre = e.currentTarget.dataset.addre;
    var lon = e.currentTarget.dataset.lon;
    var lat = e.currentTarget.dataset.lat;
    var code = e.currentTarget.dataset.code;
    var house = e.currentTarget.dataset.house;
    
    var liname = e.currentTarget.dataset.liname;
    var liphone = e.currentTarget.dataset.liphone;
    var lisex = e.currentTarget.dataset.lisex;
    wx.navigateTo({
      url: '/pages/address/editorAddress/editorAddress?aId=' + adId+ '&name=' + name + '&address=' + addre + '&lon=' + lon + '&lat=' + lat + '&code=' + code + '&house=' + house + '&liname=' + liname + '&liphone=' + liphone + '&lisex=' + lisex
    })
  },

  //删除地址事件
  delAddress: function (e) {
    var that = this;
    var address_id = e.currentTarget.dataset.addressid;
    wx.showModal({
      title: '',
      content: '删除该地址后无法恢复',
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: '#91D5AD',
      success: function (res) {
        if (res.confirm) {
          util.tokenReq('server/deleteAddress',{"addressId": address_id}, function (req) {
            if(req.code == 0){
              wx.showModal({
                title: '',
                content: '删除成功',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#91D5AD',
              })
              that.load();
            }
          })
          // that.data.items.splice(e.currentTarget.dataset.index, 1)
          // that.setData({
          //   items: that.data.items
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    let data = this._touchstart(e, this.data.items)
    this.setData({
      items: data
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    let data = this._touchmove(e, this.data.items)
    this.setData({
      items: data
    })
  },

  _touchstart: function(e, items) {
    //开始触摸时 重置所有删除
    // items.forEach(function(v, i) {
    //   if (v.isTouchMove) //只操作为true的
    //     v.isTouchMove = false;
    // })
    startX = e.changedTouches[0].clientX
    startY = e.changedTouches[0].clientY
    return items
  },

  _touchmove: function(e, items) {
    var index = e.currentTarget.dataset.index, //当前索引
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = this._angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    items.forEach(function(v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 10) return;
      if (i == index) {
        if (touchMoveX > startX){//右滑
          v.isTouchMove = false
        }
        else { //左滑
          v.isTouchMove = true
        }
      }
    })
    return items
  },

  _angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    this.load();
  }

})