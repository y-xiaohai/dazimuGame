var util = require('../../../utils/util.js');
var page1 = 1;//初始页数
var page2 = 1;
var page3 = 1;

Page({

  data: {
    navbar: ['正在进行', '我的发布', '我的服务'],
    currentTab: 0,
    showDialog: false,//控制登录的弹窗是否显示
    
    allwz: '',
    allLists: [],
    flag1: false,//开关，是否可以加载更多

    putwz: '',
    putLists: [],
    flag2: false,

    getwz: '',
    getLists: [],
    flag3: false,
  },

  // 导航切换
  navbarTap: function(e) {
    var that = this
    if (that.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  
  // 生命周期函数
  onLoad: function () {
    var _this = this;
    _this.loadPageNum();
    _this.loadAll(1);//第一次加载
    _this.loadMyPut(1);
    _this.loadMyGet(1);
  },

  //获取三个列表的总页数
  loadPageNum: function(){
    var that = this;
    util.tokenReq("mine/getOrderNum",{},function(res){
      if(res.code == '0' ){
        console.log(res.data);
        that.setData({
          totalPage1: res.data.allNum,
          totalPage2: res.data.putNum,
          totalPage3: res.data.getNum
        })
      }else if(res.code == '999'){
        that.setData({
          totalPage1: 0,
          totalPage2: 0,
          totalPage3: 0
        })
      }
    })
  },

  //加载全部订单
  loadAll: function(pageNum){
    var that = this
    util.gpsReq("mine/allOrder", {page: pageNum}, function (res) {
      if (res.code == '0') {
        console.log("正在进行列表:")
        console.log(res.data)
        if(res.data.length < 10){
          var reqState1 = false;
          that.setData({
            allwz: '没有更多啦'
          })
        } else {
          var reqState1 = true;
          that.setData({
            allwz: '上拉加载更多',
          })
        }
        var tmpArr = that.data.allLists;
        // 这一步实现了上拉加载更多
        tmpArr.push.apply(tmpArr, res.data);
        that.setData({
          allLists: tmpArr,
          flag1: reqState1,
        })
        page1++;
      } else if(res.code == '999'){
        that.setData({
          showDialog: true
        })
      }else {//请求失败
        console.log(res.msg);
      }
    })
  },

  //加载我的发布订单列表
  loadMyPut: function (pageNum) {
    var that = this
    util.gpsReq("mine/orderPutList", { page:pageNum}, function (res) {
      if (res.code == 0) {
        console.log("我的发布列表:")
        console.log(res.data)
        if (res.data.length < 10) {
          var reqState2 = false;
          that.setData({
            putwz: '没有更多啦',
          })
        } else {
          var reqState2 = true;
          that.setData({
            putwz: '上拉加载更多',
          })
        }
        var tmpArr2 = that.data.putLists;
        tmpArr2.push.apply(tmpArr2, res.data);
        that.setData({
          putLists: tmpArr2,
          flag2: reqState2,
        })
        page2++;
      } else {
        console.log(res.msg);
      }
    })
  },

  //加载我的服务订单列表
  loadMyGet: function (pageNum) {
    var that = this
    util.gpsReq("mine/orderGetList", { page: pageNum}, function (res) {
      if (res.code == 0) {
        console.log("我的服务列表:")
        console.log(res.data)
        if (res.data.length < 10) {
          var reqState3 = false;
          that.setData({
            getwz: '没有更多啦',
          })
        } else {
          var reqState3 = true;
          that.setData({
            getwz: '上拉加载更多',
          })
        }
        var tmpArr3 = that.data.getLists;
        tmpArr3.push.apply(tmpArr3, res.data);
        that.setData({
          getLists: tmpArr3,
          flag3: reqState3,
        })
        page3++;
      } else {
        console.log(res.msg);
      }
    })
  },

  //------弹窗部分函数-------
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () {},

  close: function () {
    var that = this
    that.setData({
      showDialog: false,
    })
  },

  onConfirm: function () {
    wx.reLaunch({
      url: '/pages/registe/registe',
    })
  },

  //根据当前currentTab清除缓存内容
  clearCache: function () {
    if (this.data.currentTab == 0) {
      page1 = 1;//分页标识到第一页
      this.data.allLists = [];//清空
    } else if (this.data.currentTab == 1) {
      page2 = 1;
      this.data.putLists = [];
    } else if (this.data.currentTab == 2) {
      page3 = 1;
      this.data.getLists = [];
    }
  },

  //根据当前currentTab清除缓存内容
  clearCache2: function () {
    if (this.data.currentTab == 0) {
      page1 = 1;//分页标识到第一页
      this.data.allLists = [];//清空
      page2 = 1;
      this.data.putLists = [];
      page3 = 1;
      this.data.getLists = [];
    } else if (this.data.currentTab == 1) {
      page2 = 1;
      this.data.putLists = [];
      page1 = 1;
      this.data.allLists = [];
    } else if (this.data.currentTab == 2) {
      page3 = 1;
      this.data.getLists = [];
      page1 = 1;
      this.data.allLists = [];
    }
  },
  
  //根据当前（currentTab）加载第一页
  loadOnePage: function () {
    if (this.data.currentTab == 0) {
      this.clearCache();
      this.loadAll(1)
    } else if (this.data.currentTab == 1) {
      this.clearCache();
      this.loadMyPut(1)
    } else {
      this.clearCache();
      this.loadMyGet(1)
    }
  },

  loadOnePage2: function () {
    if (this.data.currentTab == 0) {
      this.clearCache2();
      this.loadAll(1);
      this.loadMyPut(1);
      this.loadMyGet(1);
    } else if (this.data.currentTab == 1) {
      this.clearCache2();
      this.loadMyPut(1);
      this.loadAll(1);
    } else {
      this.clearCache2();
      this.loadMyGet(1);
      this.loadAll(1);
    }
  },



  //全部订单列表中点击订单到订单状态详情页面
  toDetail: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var business_id = e.currentTarget.dataset.bid;
    var business_deal_id = e.currentTarget.dataset.did;
    var distance = e.currentTarget.dataset.dis;
    if (distance == undefined){
      wx.navigateTo({
        url: '/pages/order/publisherOrderInfo/publisherOrderInfo?business_id=' + business_id
      })
    }else{
      wx.navigateTo({
        url: '/pages/order/accepterOrderInfo/accepterOrderInfo?business_deal_id=' + business_deal_id
      })
    }
  },

  //----------------全部订单页面操作订单的方法--------
  //1.接单者操作订单方法
  doOperaterGet: function (options) {
    var _this = this;
    //console.log(options);
    util.tokenReq("dealdo/update", {
      business_deal_id: options.currentTarget.dataset.dealid,
      operation_code: options.currentTarget.dataset.code
    }, function (req) {
      console.log(req)
      if (req.code == 0) {
        wx.showToast({
          title: '操作成功',
        })
        // _this.clearCache();
        // _this.loadAll(page1);
        _this.loadPageNum();
        _this.loadOnePage2();
      }
    })
  },
  //2.发布者操作订单方法
  doOperaterPut: function (options) {
    var _this = this;
    if (options.currentTarget.dataset.code == 2000) {
      util.tokenReq("businessdo/detele", {
        business_id: options.currentTarget.dataset.busid
      }, function (req) {
        if (req.code == 0) {
          wx.showToast({
            title: '操作成功',
          })
          // _this.clearCache();
          // _this.loadAll(page1);
          _this.loadPageNum();
          _this.loadOnePage2();
        }
      })
    } else {
      util.tokenReq("businessdo/operateBusiness", {
        business_id: options.currentTarget.dataset.busid,
        operation_code: options.currentTarget.dataset.code
      }, function (req) {
        console.log(req)
        if (req.code == 0) {
          wx.showToast({
            title: '操作成功',
          })
          // _this.clearCache();
          // _this.loadAll(page1);
          _this.loadPageNum();
          _this.loadOnePage2();
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("orderMain.onShow")
    var _this = this;
    _this.loadPageNum();
  },

  notoperate: function(){},

  //全部订单列表里的打电话
  telphone: function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

// ----------------发布订单列表操作部分-----------
  // 发单者列表里的打电话接单者
  telget: function (e) {
    console.log(e)
    util.tokenReq("businessdo/get", { 
        business_id: e.currentTarget.dataset.businessid 
      }, function (res) {
      if (res.code == 0) {
        wx.makePhoneCall({
          phoneNumber: res.data.deal_info.login_phone
        })
      }
    })
  },
  //发单者列表里的确认服务
  confirmService: function (e) {
    var _this = this;
    var businessId = e.currentTarget.dataset.businessid;
    var code = e.currentTarget.dataset.putcode;
    util.tokenReq("businessdo/operateBusiness", { business_id: businessId, operation_code: code }, function (req) {
      console.log(req)
      if (req.code == 0) {
        wx.showToast({
          title: '操作成功',
        })
        // _this.clearCache();
        // _this.loadMyPut(page2);
        _this.loadPageNum();
        _this.loadOnePage2();
      }
    })
  },
  //发单者列表里的确认付款
  payOrder: function (e) {
    var _this = this
    var businessId = e.currentTarget.dataset.businessid;
    var code = e.currentTarget.dataset.putcode;
    console.log(e);
    util.tokenReq("businessdo/operateBusiness", { business_id: businessId, operation_code: 1040 }, function (req) {
      if (req.code == 0) {
        wx.showToast({
          title: '操作成功',
        })
        // _this.clearCache();
        // _this.loadMyPut(page2);
        _this.loadPageNum();
        _this.loadOnePage2();
      } else {
        wx.showToast({
          icon: "none",
          title: req.msg,
        })
      }
    })    
  },
  //发单者列表里的取消订单
  cancelOrder: function (e) {
    this.deleteOrder(e);
  },
  //发单者列表里的删除订单
  deleteOrder: function (e) {
    var _this = this
    console.log(e)
    var businessId = e.currentTarget.dataset.businessid;
    console.log(e.currentTarget.dataset)
    util.tokenReq("businessdo/detele", { business_id: businessId }, function (req) {
      if (req.code == 0) {
        wx.showToast({
          title: '操作成功',
        })
        // _this.clearCache();
        // _this.loadMyPut(page2);
        _this.loadPageNum();
        _this.loadOnePage2();
      } else {
        wx.showToast({
          icon: "none",
          title: req.msg,
        })
      }
    })
  },
  

//----------- 服务者列表操作部分--------------
  // 接单者打电话发单者
  telput: function (e) {
    console.log(e.currentTarget.dataset.num)
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.num
    })
  },
  //接单者列表里的操作订单
  operateOrder: function(e){
    var _this = this
    util.tokenReq("dealdo/update", {
      business_deal_id: e.currentTarget.dataset.dealid,
      operation_code: e.currentTarget.dataset.getcode
    }, function (res) {
      if(res.code == 0){
        wx.showToast({
          title: '操作成功',
        })
        // _this.clearCache();
        // _this.loadMyGet(page3);
        _this.loadPageNum();
        _this.loadOnePage2();
      }
    })
  },
  
  //跳转到订单详情页面
  navigatDetail: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  //跳转到发布订单页面
  toPutOrder: function () {
    wx.switchTab({
      url: '../../publish/putOrder/putOrder',
    })
  },
  //跳转到主页
  toMain: function () {
    wx.switchTab({
      url: '../../index/mainNew/mainNew',
    })
  },

  //监听用户下拉动作
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新',
    })
    this.loadOnePage2();
    util.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    if (this.data.currentTab == 0){
      if(_this.data.flag1){
        this.loadAll(page1);//后台获取新数据并追加渲染
      }
    } else if(this.data.currentTab == 1){
      if(_this.data.flag2){
        this.loadMyPut(page2);
      }
    } else if(this.data.currentTab == 2){
      if (_this.data.flag3) {
        this.loadMyGet(page3);
      }
    }
  },

  onTabItemTap(item) {
    wx.hideTabBarRedDot({
      index: 2
    })
  }
})