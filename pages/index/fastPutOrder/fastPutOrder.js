var util = require('../../../utils/util.js');
var isClick = true;

Page({

  data: {
    titleTS: "请填写标题，发布您的需求",
    contentTS: "添加需求详情（100字以内）",
    content: 'helper，接单后电话联系',
    showDialog: false,//弹窗是否显示
  },

  inputEidt: function (e) {
    let _this = this;
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let name = dataset.name;
    let arr = [];
    arr[name] = e.detail.value;
    _this.setData(arr);
  },

  inputContent: function(e){
    var that = this
    console.log(e)
    if (e.detail.value == '' || e.detail.value == undefined){
      that.setData({
        content: 'helper，接单后电话联系'
      })
    }else{
      that.setData({
        content: e.detail.value
      })
    }
  },

  onLoad: function (options) {
    //console.log(options)
    var advice = '建议价格：' + options.price;
    var _this = this
    _this.setData({
      image: options.image,
      users_id: options.users_id,
      helper_name: options.helper_name,
      classId: options.classId,
      priceTS: advice
    })
    _this.getCurrentAddress();
  },

  //获取当前位置
  getCurrentAddress: function(){
    var that = this;
    util.gpsReq('Pub/getAddressByGps', {}, function (req) {
      console.log(req.data);
      that.setData({
        name: req.data.name,
        address: req.data.address,
        city_code: req.data.city_code,
        city_name: req.data.city_name,
        hx_lat: req.data.hx_lat,
        hx_lon: req.data.hx_lon,
      })
    })
  },

  //输入的价格
  inputPrice: function (e) {
    var val = util.numberCheck(e.detail.value);
    this.setData({
      price: val
    })
  },

  //点击预览图片
  previewImg: function (e) {
    var current = e.currentTarget.dataset.ur
    var arrImg = [];
    arrImg.push(this.data.image)//为了预览才放到数组里
    wx.previewImage({
      urls: arrImg,
      current: current,
      success: function (e) {
        console.log('预览成功')
      }
    })
  },

  //确认发布的方法
  putSumbit: function (e) {
    var formId = e.detail.formId;
    if (formId != 'the formId is a mock one') {
      util.tokenReq("mine/getFormId", {
        form_id: formId
      }, function (red) {
        if (red.code == "0") {
          console.log("传给后台formId成功")
        }
      })
    }
    var that = this
    console.log(that.data);
    // console.log(e.detail.formId)
    if (that.data.title == undefined || that.data.title == '') {
      wx.showToast({
        title: '请填写标题',
        icon: 'none'
      })
      return
    } else if (that.data.price == undefined || that.data.price == '') {
      wx.showToast({
        title: '请填写价格',
        icon: 'none'
      })
      return
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
          house_num: '506',
          price: that.data.price,
          images: that.data.image,
          helper_users_id: that.data.users_id,
          helper_users_name: that.data.helper_name,
          formId: formId
        }, function (res) {
          if (res.code == '0') {
            console.log(res.data)
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
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
            })
          }
        })
        setTimeout(function () {
          isClick = true;
        }, 1000);
      }
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

  onConfirm: function () {
    wx.reLaunch({
      url: '/pages/registe/registe',
    })
  }
  
})