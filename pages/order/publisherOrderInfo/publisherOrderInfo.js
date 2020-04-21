var util = require('../../../utils/util.js');

Page({
  data: {
    remark: '',
    marked: '',
    getterInfo: 'hiddenInfo',//接单者资料，默认隐藏
    is_show: false, //默认不显示
    seeMore: '查看订单详情',
    color1: "",
    color2: "",
    color3: "",
    color4: "",
    color5: "",
    disService: "hidden",
    disPay: "hidden",
    disCancel: "hidden",
    disDelete: "hidden",
    disTel: "hidden",

    callPhone: 'hiddenCall'
  },

  //查看详情
  seeMore: function() {
    var that = this;
    that.setData({
      is_show: (!that.data.is_show),
    })
    if (that.data.is_show == true) {
      that.setData({
        seeMore: '收起订单详情'
      })
    } else {
      that.setData({
        seeMore: '查看订单详情'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.business_id)
    this.load(options.business_id);
  },

  load: function(business_id) {
    var _this = this;
    util.tokenReq("businessdo/get", {
      business_id: business_id
    }, function(req) {
      if (req.code == "0") {
        _this.setData(req.data)
        console.log(req.data)
        var status_remark = req.data.status_remark;
        var status = req.data.status;
        var point_remark = req.data.point_remark;

        if (status != "0" && status != "2010" && status != "2020"){
          var realName = req.data.deal_info.real_name;
          var realSex = req.data.deal_info.sex;
          var phoneNum = req.data.deal_info.login_phone;
          if (realSex == "1") {
            if (realName.length >= 2 && realName.length < 4) {
              realName = realName.substring(0, 1) + "先生";
            } else if (name.length >= 4) {
              realName = realName.substring(0, 2) + "先生";
            }
          } else if (realSex == "2") {
            if (realName.length >= 2 && realName.length < 4) {
              realName = realName.substring(0, 1) + "女士";
            } else if (name.length >= 4) {
              realName = realName.substring(0, 2) + "女士";
            }
          }
          _this.setData({
            processRealName: realName
          })
          //将手机号码后8位隐藏
          if(status == '1040'){
            phoneNum = phoneNum.substring(0, 3) + ' **** ****';
            _this.setData({
              processPhone: phoneNum
            })
          }else{
            phoneNum = phoneNum.substring(0, 3) + ' ' + phoneNum.substring(3, 7) + ' ' + phoneNum.substring(7);
            _this.setData({
              processPhone: phoneNum
            })
          } 
        }
        if (status == "0") {
          _this.setData({
            remark: '等待接单', //可以取消订单
            marked: "24小时内订单没有被接，系统会自动取消",
            color1: "color",
            color2: "",
            color3: "",
            color4: "",
            color5: "", 
            getterInfo: 'hiddenInfo',
            disService: "hidden",
            disPay: "hidden",
            disCancel: "",
            disDelete: "hidden",

            disTel: "hidden",
            callPhone: 'hiddenCall'
          })
        } else if (status == "1005") {
          _this.setData({
            remark: '等待确认',//可以确认用户(操作码1000)/联系接单者/取消订单
            marked: "确认用户服务后不可取消订单哦，若有疑问，请拨打客服热线",
            color1: "color",
            color2: "color",
            color3: "",
            color4: "",
            color5: "",
            getterInfo: '',
            disService: "",
            disPay: "hidden",
            disCancel: "",
            disDelete: "hidden",
            
            disTel: "",
            callPhone: ''
          })
        } else if (status == "1000" || status == "1010" || status == "1020") {
          _this.setData({
            remark: '等待服务', //可以联系接单者
            marked: "帮忙，我的生活我做主！ 举手之劳，何乐而不为？",
            color1: "color",
            color2: "color",
            color3: "color",
            color4: "",
            color5: "",
            getterInfo: '',
            disService: "hidden",
            disPay: "hidden",
            disCancel: "hidden",
            disDelete: "hidden",
            
            disTel: "",
            callPhone: ''
          })
        } else if (status == "1030") {
          _this.setData({
            remark: '服务完成', //可以确认付款  联系接单者
            marked: "诚信为本，操守为重，以真诚之心，行信义之事",
            color1: "color",
            color2: "color",
            color3: "color",
            color4: "color",
            color5: "",
            getterInfo: '',
            disService: "hidden",
            disPay: "",
            disCancel: "hidden",
            disDelete: "hidden",

            disTel: "",
            callPhone: ''
          })
        } else if (status == "1040") {
          var point = point_remark.replace(/[^(\d+(\.\d+)?)]/ig, "");
          _this.setData({
            remark: '订单已关闭', //可以删除订单  联系接单者
            marked: "恭喜您，你的账户又增加了"+ point +"积分",
            color1: "color",
            color2: "color",
            color3: "color",
            color4: "color",
            color5: "color",
            getterInfo: '',
            disService: "hidden",
            disPay: "hidden",
            disCancel: "hidden",
            disDelete: "",

            disTel: "hidden",
            callPhone: 'hiddenCall'
          })
        } else if (status == "2010") {
          _this.setData({
            remark: '订单已取消', //可以删除订单
            marked: "诚信为本，操守为重，以真诚之心，行信义之事",
            color1: "",
            color2: "",
            color3: "",
            color4: "",
            color5: "color",
            getterInfo: 'hiddenInfo',
            disService: "hidden",
            disPay: "hidden",
            disCancel: "hidden",
            disDelete: "",

            disTel: "hidden",
            callPhone: 'hiddenCall'
          })
        } else if (status == "2020") {
          _this.setData({
            remark: '订单已过期',
            marked: "诚信为本，操守为重，以真诚之心，行信义之事",
            color1: "",
            color2: "",
            color3: "",
            color4: "",
            color5: "color",
            getterInfo: 'hiddenInfo',
            disService: "hidden",
            disPay: "hidden",
            disCancel: "",
            disDelete: "hidden",

            disTel: "hidden",
            callPhone: 'hiddenCall'
          })
        }
      }
    })
  },

  //确认用户
  // confirmService: function() {
  //   console.log('点了确认用户')
  //   var _this = this;
  //   util.tokenReq("businessdo/operateBusiness", {
  //     business_id: _this.data.business_id,
  //     operation_code: 1000
  //   }, function(req) {
  //     console.log(req)
  //     if (req.code == 0) {
  //       wx.showToast({
  //         title: '操作成功',
  //       })
  //       _this.load(_this.data.business_id)
  //     }
  //   })
  // },

  // //确认付款
  // payOrder: function() {
  //   console.log('点了确认付款')
  //   var _this = this
  //   util.tokenReq("businessdo/operateBusiness", {
  //     business_id: _this.data.business_id,
  //     operation_code: 1040
  //   }, function(req) {
  //     if (req.code == "0") {
  //       wx.showToast({
  //         title: '操作成功',
  //       })
  //       _this.load(_this.data.business_id)
  //     } else {
  //       wx.showToast({
  //         icon: "none",
  //         title: req.msg,
  //       })
  //     }
  //   })
  // },

  //操作订单
  doOperater: function (e) {
    console.log("caozuole")
    console.log(e.currentTarget.dataset.code)
    var _this = this;
    util.tokenReq("businessdo/operateBusiness", {
      business_id: _this.data.business_id,
      operation_code: e.currentTarget.dataset.code
    }, function(req) {
      console.log(req)
      if (req.code == 0) {
        wx.showToast({
          title: '操作成功',
        })
        _this.load(_this.data.business_id)
        // ---刷新订单页面---
        var prev = util.prevPage(2);//上页
        //console.log(prev)
        prev.loadOnePage2();
      }
    })
  },

  //取消订单
  cancelOrder: function() {
    console.log('点了取消订单')
    var _this = this
    util.tokenReq("businessdo/detele", {
      business_id: _this.data.business_id
    }, function (req) {
      if (req.code == "0") {
        wx.showToast({
          title: '操作成功',
        })
        _this.load(_this.data.business_id)
        // ---刷新订单页面---
        var prev = util.prevPage(2);//上页
        //console.log(prev)
        prev.loadOnePage2();
      } else {
        wx.showToast({
          title: req.msg,
          icon: "none"
        })
      }
    })
  },

  //删除订单
  deleteOrder: function() {
    console.log('点了删除订单')
    var _this = this
    util.tokenReq("businessdo/detele", {
      business_id: _this.data.business_id
    }, function(req) {
      if (req.code == "0") {
        wx.showToast({
          title: '操作成功',
          success: function () {
            // ---刷新订单页面---
            var prev = util.prevPage(2);//上页
            //console.log(prev)
            prev.loadOnePage2();
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      } else {
        wx.showToast({
          icon: "none",
          title: req.msg,
        })
      }
    })
  },

  //打电话给接单者
  tel: function() {
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.deal_info.login_phone
    })
  },

  //打电话给接单者
  telget: function (e) {
    console.log(e.currentTarget.dataset.fdphone)
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.fdphone
    })
  },

  //客服电话
  telKF: function() {
    wx.makePhoneCall({
      phoneNumber: '89019298',
    })
  },

  previewImg: function (e) {
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      urls: this.data.images,
      current: current,
      success: function (e) {
        console.log('预览成功')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '正在刷新',
    })
    var business_id = this.data.business_id;
    this.load(business_id);
    util.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})