var util = require('../../../utils/util.js');
var isClick = true;

Page({

  data: {
    images: [],
    showDialog: false,//弹窗是否显示
  },

  onLoad: function (options) {
    console.log(options)
    var _this = this
    util.gpsReq("index/BusinessDetail",{'business_id': options.business_id}, function (res) {
      console.log(res.data)
      if (res.code == "0") {
        _this.setData(res.data)
        if (res.data.h_count != ''){
          _this.setData({
            ddsl: '（' + res.data.h_count + '个）'
          })
        }
      } else if (res.code == "600") {//订单已被抢
        wx.showModal({
          title: '',
          content: '订单已被抢!\r\n请刷新后再试',
          showCancel: false,
          success(red) {
            if (red.confirm) {
              wx.reLaunch({
                url: '/pages/index/mainNew/mainNew',
              })
            }
          }
        }) 
      }
    })
  },

  //点击预览图片
  previewImg: function(e){
    var current = e.currentTarget.dataset.ur
    wx.previewImage({
      urls: this.data.images,
      current: current,
      success: function(e){
        console.log('预览成功')
      }
    })
  },

  //接订单
  getOrder: function (e) {
    var formId = e.detail.formId;
    var that = this
    if (isClick) {
      isClick = false;
      util.tokenReq("mine/getFormId", {form_id: formId}, function (red) {
        if (red.code == "0") {
          console.log("传给后台formId成功")
        }
      })

      util.gpsReq("dealdo/checkAdd", {business_id: that.data.business_id}, function (res) {
        if (res.code == "0") {//可以接单的状态
          wx.showModal({
            title: '提示',
            content: '是否确认接单？',
            confirmText: '接单',
            success(req) {
              if (req.confirm) {
                util.gpsReq("dealdo/add", { business_id: that.data.business_id }, function (re) {
                  if (re.code == "0") {//即接单成功
                    wx.showToast({
                      title: '接单成功，请等待发布方确认',
                      icon: 'none',
                      duration: 1500
                    })
                    //接单成功就刷新主页订单
                    var prev = util.prevPage(2);//上页
                    console.log(prev)
                    prev.data.orderList = [];//先清空
                    prev.onLoad();
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/order/orderMain/orderMain'
                      })
                    }, 1500);
                  } else {
                    wx.showToast({
                      title: re.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              } else if (req.cancel) {
                console.log('用户点击了取消')
              }
            }
          })
        } else if (res.code == "600") {
          if (res.msg == "请先发单") {
            wx.showModal({
              title: '',
              content: '需要您发单激活账户\r\n才能接单哦~',
              showCancel: false,
              confirmText: '激活账户',
              confirmColor: '#91D5AD',
              success(rs) {
                if (rs.confirm) {
                  wx.switchTab({
                    url: '/pages/publish/putOrder/putOrder',
                  })
                }
              }
            })
          } else if (res.msg == "订单被抢啦") {
            wx.showModal({
              title: '',
              content: '订单已被抢!\r\n请刷新后再试',
              showCancel: false,
              success(rs) {
                if (rs.confirm) {
                  wx.switchTab({
                    url: '/pages/index/mainNew/mainNew',
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        } else if (res.code == '700') {
          wx.showModal({
            title: '',
            content: '请您先实名认证！',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#91D5AD',
            success: function (rs) {
              if (rs.confirm) {
                wx.redirectTo({
                  url: '/pages/realName/authentication/authentication'
                })
              }
            }
          }) 
        } else if(res.code =='999'){
          that.setData({
            showDialog: true
          })
        }
      })
      setTimeout(function () {
        isClick = true;
      }, 1000);
    }
  },

  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () {},

  close: function () {
    var that = this
    that.setData({
      showDialog: false,
    })
  },

  onConfirm: function(){
    wx.reLaunch({
      url: '/pages/registe/registe',
    })
  },

  onCancel: function () {
    this.close();
  },

  //订单投诉
  complaint: function () {
    var that = this
    var itemList = ['传播色情低俗信息', '违法（暴力恐怖、违禁品等）', '广告等垃圾订单', '其他（收集隐私信息等）'];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        var content = itemList[res.tapIndex];
        util.tokenReq("index/complain",{
          'business_id': that.data.business_id,
          "content": content
        }, function (re) {
          if(re.code == 0){
            wx.showModal({
              title: '',
              content: '投诉成功，我们将第一时间\r\n受理您的投诉信息！',
              showCancel: false,
              confirmText: '我知道了',
              confirmColor: '#91D5AD',
              success: function (red) {
                console.log(red)
              }
            })
          }
        })  
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
  
})
