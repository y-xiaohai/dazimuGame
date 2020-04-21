var util = require('../../../utils/util.js');
var isClick = true;

Page({

  data: {
    showWin: true, //选择地址弹窗是否显示
    titleTS: "请填写标题，发布您的需求",
    adressTs: "选择服务地址",
    priceTS: "金额不能小于2.5元哦~",
    content: 'helper，接单后电话联系',
    showDialog: false, //登录弹窗是否显示
    className: '临时帮',
    classId: 1,
    imgUrls: []
  },

  //页面加载
  onLoad: function (options) {
    util.getQiniuToken();
    this.loadAddressList();
  },

  //预加载服务地址
  loadAddressList: function () {
    var that = this
    util.tokenReq("server/AddressList", {}, function (res) {
      if (res.code == 0) {
        that.setData({
          items: res.data,
        })
      }
    })
  },

  //聚焦时
  bindfocusa: function() {
    this.setData({
      titleTS: ''
    })
  },
  bindfocusb: function() {
    this.setData({
      priceTS: ''
    })
  },
  //失去焦点
  bindblura: function() {
    this.setData({
      titleTS: '请填写标题，发布您的需求'
    })
  },
  bindblurb: function() {
    this.setData({
      priceTS: '金额不能小于2.5元哦~'
    })
  },

  inputEidt: function(e) {
    let _this = this;
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let name = dataset.name;
    let arr = [];
    arr[name] = e.detail.value;
    _this.setData(arr);
  },

  //输入的价格
  inputPrice: function(e) {
    var val = util.numberCheck(e.detail.value);
    this.setData({
      price: val
    })
  },

  // 选择服务地址
  chooseAddress: function() {
    this.loadAddressList();
    wx.hideTabBar({});
    this.setData({
      showWin: false
    })
  },

  //选择分类
  chooseClass: function() {
    wx.navigateTo({
      url: '../chooseClass/chooseClass'
    })
  },

  //点击获取焦点事件
  choosePrice: function(e) {
    this.setData({
      focus: true
    })
  },

  //上传图片的方法
  didPressChooesImage: function() {
    var that = this;
    util.didPressChooesImage(that); //调用util里的方法
  },

  //删除图片的方法
  deleteImage: function(e) {
    var id = e.currentTarget.dataset.id;
    var imgUrls = this.data.imgUrls;
    imgUrls.splice(id, 1);
    this.setData({
      imgUrls: imgUrls
    });
  },

  //确认发布的方法
  putSumbit: function(e) {
    var that = this;
    var formId = e.detail.formId;
    if (formId != 'the formId is a mock one') {
      util.tokenReq("mine/getFormId", {form_id: formId}, function(red) {
        if (red.code == "0") {
          console.log("传给后台formId成功")
        }
      })
    }
    if (that.data.title == undefined) {
      wx.showToast({
        title: '请填写标题',
        icon: 'none'
      })
    } else if (that.data.name == undefined) {
      wx.showToast({
        title: '请选择服务地址',
        icon: 'none'
      })
    }else if (that.data.price == undefined) {
      wx.showToast({
        title: '请填写价格',
        icon: 'none'
      })
    } else {
      if (isClick) {
        isClick = false;
        util.tokenReq("businessdo/setBusiness", {
          class_id: that.data.classId,
          class_two_id: '14',
          title: that.data.title,
          content: that.data.content,
          city_code: that.data.city_code,
          name: that.data.name,
          hx_lon: that.data.hx_lon,
          hx_lat: that.data.hx_lat,
          house_num: that.data.house_num,
          price: that.data.price,
          images: that.data.imgUrls,
          formId: formId
        }, function(res) {
          if (res.code == '0') {
            var bussiness_id = res.data.business_id;
            var price = that.data.price;
            var title = that.data.title;
            wx.navigateTo({
              url: '/pages/publish/choosePay/choosePay?business_id=' + bussiness_id + '&price=' + price + '&title=' + title
            })
          } else if (res.code == '999') {
            that.setData({
              showDialog: true
            })
          } else if (res.code == '600') {
            if (res.msg == '经度必传'){
              wx.showToast({
                title: '请选择服务地址',
                icon: "none",
              })
            } else if (res.msg == '金额必须输入') {
              wx.showToast({
                title: '请填写价格',
                icon: "none",
              })
            } else if (res.msg == '标题必填') {
              wx.showToast({
                title: '请填写标题',
                icon: "none",
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none",
              })
            }
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
            })
          }
        })
        setTimeout(function() {
          isClick = true;
        }, 1000);
      }
    }
  },

  //=======地址弹窗相关函数======
  closeAddwin: function() {
    this.setData({
      showWin: true
    })
    wx.showTabBar({});
  },

  radioChange: function(e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
    this.closeAddwin();
  },

  setSerAddress: function(e) {
    let name = e.currentTarget.dataset.name
    let address = e.currentTarget.dataset.addre
    let city_code = e.currentTarget.dataset.code
    let hx_lon = e.currentTarget.dataset.lon
    let hx_lat = e.currentTarget.dataset.lat
    let house = e.currentTarget.dataset.house
    this.setData({
      name: name,
      // address: address,
      city_code: city_code,
      hx_lon: hx_lon,
      hx_lat: hx_lat,
      house_num: house,
    })
  },

  toEditorAddress: function (e) {
    var that = this;
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
      url: '/pages/address/editorAddress/editorAddress?aId=' + adId + '&name=' + name + '&address=' + addre + '&lon=' + lon + '&lat=' + lat + '&code=' + code + '&house=' + house + '&liname=' + liname + '&liphone=' + liphone + '&lisex=' + lisex
    })
    setTimeout(function () {
      that.closeAddwin()
    }, 1500);  
  },

  toAddressAdd: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/address/addressAdd/addressAdd'
    })
    setTimeout(function () {
      that.closeAddwin()
    }, 1500);
  },

  //-------------- 登录弹框操作函数------------
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function() {},

  close: function() {
    var that = this
    that.setData({
      showDialog: false,
    })
  },

  onConfirm: function() {
    wx.reLaunch({
      url: '/pages/registe/registe',
    })
  },

  //生命周期函数--监听页面显示
  onShow: function() {
    wx.showTabBar({})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }

})