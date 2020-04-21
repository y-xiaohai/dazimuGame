var util = require('../../../utils/util.js');
var timer;//定时器

const app = getApp();

Page({
  
  data: {
    navbar: ['全部', '临时帮', '社交帮','智囊团', '达人帮', '维修帮', '跑腿帮', '租赁帮', '美食帮', '杂货帮'],
    showtab: 0,
    isShow: false,
    orderList: []
  },
  record: { page: 1, isEnd: false },//用于记录的对象

  //监听页面初次渲染完成
  onReady: function () {
    var that = this;
    wx.createSelectorQuery().select('#header').boundingClientRect(function (rect) {
      that.setData({
        fixTop: rect.height
      })
    }).exec();
  },

  onPageScroll: function (e) {
    if (e.scrollTop >= this.data.fixTop) {
      this.setData({
        tabbarFix: true
      })
    } else {
      this.setData({
        tabbarFix: false
      })
    }
  },

  //获取订单
  getLists: function () {
    var _this = this
    var classId = this.data.showtab == 1 ? 1 : this.data.showtab == 2 ? 8 : this.data.showtab == 3 ? 3 : this.data.showtab == 4 ? 5 : this.data.showtab == 5 ? 6 : this.data.showtab == 6 ? 2 : this.data.showtab == 7 ? 4 : this.data.showtab == 8 ? 56 : this.data.showtab == 9 ? 7 : '';
    
    var pageNum = this.record.page;
    var city_code = wx.getStorageSync('city_code');
    util.gpsReq('index/Index', { class_id: classId, page: pageNum, city_code: city_code }, function (res) {
      if (res.code == 0) {
        var list = res.data.order_list;
        _this.setData({
          helperList: res.data.helper_list,
          orderList: (_this.data.orderList).concat(list)
        })
        if(_this.data.orderList.length > 0){
          _this.setData({
            isShow: false
          })
        }else{
          _this.setData({
            isShow: true
          })
        }
        if (list.length < 24) {
          _this.record.isEnd = true
        } else {
          _this.record.page++
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }) 
  },

  //监听页面加载
  onLoad: function () {
    // console.log("mainNew的onLoad")
    var _this = this
    _this.getPageInfo();
  },

  //是否显示首页弹窗
  isWindow: function(){
    var _this = this;
    if (app.globalData.mainWind) {
      _this.setData({
        showDialog: true
      })
    }        
  },

  //获得页面信息
  getPageInfo: function () {
    var _this = this;
    wx.getLocation({ //获取经纬度
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude//纬度
        const longitude = res.longitude//经度
        wx.setStorage({
          key: "gps_lon",
          data: longitude
        })
        wx.setStorage({
          key: "gps_lat",
          data: latitude
        })
        // 获取轮播图广告
        util.req('pub/getAdv', {}, function (re) {
          if (re.code == 0) {
            _this.setData({
              adv_list: re.data,
              yytp: "/images/bnyy.png"
            })
          }
        })
        util.req('Pub/getAddressByGps', { gps_lon: longitude, gps_lat: latitude }, function (re) {
          console.log(re.data)
          if (re.code == '0') {
            wx.setStorage({
              key: "city_code",
              data: re.data.city_code
            })
            _this.getLists();
            _this.isWindow();
            app.globalData.mainWind = false;
          } else {
            wx.showToast({
              title: re.msg,
              icon: 'none'
            })
          }
        })
      },
      fail: function (res) {
        console.log("获取经纬度失败")
      }
    })
  },

  setTab: function (e) {
    var that = this
    if(that.data.showtab == e.currentTarget.dataset.tabindex){
      return;
    }
    that.setData({
      showtab: e.currentTarget.dataset.tabindex
    })
    //每切换tab时先初始化
    that.record = {page: 1,isEnd: false}
    // that.data.orderList = [];
    that.setData({
      orderList: []
    })
    that.getLists();
  },

  onPullDownRefresh: function () {
    var that = this
    wx.showLoading({
      title: '正在刷新',
    })
    that.record = { page: 1, isEnd: false }
    that.data.orderList = [];//先清空
    // that.setData({
    //   orderList: []
    // })
    that.getPageInfo();
    util.initData();
  },

  onReachBottom: function(){
    var that = this;
    if(!this.record.isEnd){
      wx.showLoading({
        title: '加载中',
      })
      that.getLists();
      setTimeout(function () {
        wx.hideLoading();
      }, 1000); 
    }
  },

  onShow: function () {
    this.timerMeth();
    // console.log("mainNew的onShow")
  },

  //人物详情页
  personDetail: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  //订单详情页
  navigatDetail:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  
  //点击相应的轮播图进入到的页面
  tabImg: function (e) {
    if (e.currentTarget.dataset.type == '1010'){
      if(e.currentTarget.dataset.jumpurl != "") {
        wx.navigateTo({
          url: '/pages/index/out/out?src=' + e.currentTarget.dataset.jumpurl,
        })
      }
    } else if(e.currentTarget.dataset.type == '1020') {
        wx.navigateTo({
          url: '/pages/index/morePerson/morePerson',
        })
    } else if (e.currentTarget.dataset.type == '1030'){
        wx.navigateTo({
          url: '/pages/index/personDetailNew/personDetailNew?personId=5',
        })
    }
  },

  //跳转发单页面
  toPutOrder: function(){
    wx.switchTab({
      url: '../../publish/putOrder/putOrder',
    })
  },

  //定时刷新是否有被接的订单
  timerMeth: function () {
    timer = setInterval(function () {
      util.tokenReq('mine/checkNewOrder', {}, function (res) {
        if (res.code == '0') {
          wx.showTabBarRedDot({
            index: 2,
          })
        }
      })
    }, 120000);
  },

  onUnload: function () {
    clearInterval(timer);
    // console.log("mainNew的onUnload")
  },

  onHide: function(){
    // console.log("mainNew的onHide")
  },


  //------弹窗部分函数-------
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () { },

  close: function () {
    var that = this
    that.setData({
      showDialog: false,
    })
  }
  
})