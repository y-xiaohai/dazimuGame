var util = require('../../../utils/util.js');

Page({
  //页面的初始数据
  data: {
    remark: '',
    marked: '',
    putterInfo: '', //发单者信息
    is_show: false,//默认不显示
    images: [],
    seeMore: '查看订单详情',
    color1: "",
    color2: "",
    color3: "",
    color4: "",
    color5: "",
    callPhone: 'hiddenCall'
  },

  //查看详情函数
  seeMore: function () {
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
  onLoad: function (options) {
    //console.log(options.business_deal_id)
    this.setData({
      dealId: options.business_deal_id
    })
    this.load(options.business_deal_id);
  },

  load: function (business_deal_id) {
    var _this = this;
    util.gpsReq("dealdo/get", {business_deal_id: business_deal_id }, function (req) {
      if (req.code == "0") {
        _this.setData(req.data)
        console.log(req.data);
        var status_remark = req.data.status_remark;
        var status = req.data.status;
        var realName = req.data.users_info.real_name;
        var realSex = req.data.users_info.sex;
        var phoneNum = req.data.users_info.login_phone; //获取到数据    
        if(realSex == "1"){
          if (realName.length >= 2 && realName.length < 4) {
            realName = realName.substring(0, 1) + "先生";
          } else if (name.length >= 4) {
            realName = realName.substring(0, 2) + "先生";
          }
        } else if (realSex == "2"){
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
        if (status == '1005'||status == '1040'||status == '2010'){
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
        
        if (status == "1005") {
          _this.setData({
            remark: '等待确认',
            marked: "临时有事请联系发单者取消订单或拨打客服热线：89019298",
            color1: "color",
            putterInfo: '',
            callPhone: "hiddenCall"
          })
        } else if (status == "1000") {
          _this.setData({
            remark: '准备服务',
            marked: "临时有事请拨打客服热线：89019298",
            color1: "color",
            color2: "color",
            putterInfo: '',
            callPhone: ""
          })
        } else if (status == "1010" || status == "1020" ) {
          _this.setData({
            remark: '正在服务',
            marked: "服务者，当怀一颗匠心，然咫尺匠心难，服务无止境",
            color1: "color",
            color2: "color",
            color3: "color",
            putterInfo: "",
            callPhone: ""
          })
        } else if (status == "1030") {
          _this.setData({
            remark: '完成服务',
            marked: "若已服务完成，可联系发单方确认付款",
            color1: "color",
            color2: "color",
            color3: "color",
            color4: "color",
            putterInfo: "",
            callPhone: ""
          })
        } else if ( status == "1040"){
          _this.setData({
            remark: '订单已关闭',
            marked: "诚信为本，操守为重，以真诚之心，行信义之事",
            color1: "color",
            color2: "color",
            color3: "color",
            color4: "color",
            color5: "color",
            putterInfo: '',
            callPhone: 'hiddenCall'
          })
        }else if (status == "2010"){
          _this.setData({
            remark: '订单已取消',
            marked: "诚信为本，操守为重，以真诚之心，行信义之事",
            color5: "color",
            putterInfo: '',
            callPhone: 'hiddenCall'
          })
        }
      } 
    })
  },
  
  //操作订单
  doOperater: function (e){
    var _this = this;
    console.log(_this.data);
    if (e.currentTarget.dataset.code == 2000){
      util.tokenReq("dealdo/update", {
        business_deal_id: _this.data.dealId,
        operation_code: e.currentTarget.dataset.code
      }, function (req) {
        console.log(req)
        if (req.code == 0) {
          wx.showToast({
            title: '操作成功',
            success: function(){
              setTimeout(function(){
                // ---刷新订单页面---
                var prev = util.prevPage(2);//上页
                //console.log(prev)
                prev.loadOnePage2();
                wx.navigateBack({
                  delta: 1
                })
              },2000)
            }
          })
        } else {
          wx.showToast({
            title: req.msg,
            icon: 'none'
          })
        }
      })
    }else{//除删除外的操作（不用返回页面）
      util.tokenReq("dealdo/update", {
        business_deal_id: _this.data.dealId,
        operation_code: e.currentTarget.dataset.code
      }, function (req) {
        console.log(req)
        if (req.code == 0) {
          wx.showToast({
            title: '操作成功',
          })
          _this.load(_this.data.dealId)
          // ---刷新订单页面---
          var prev = util.prevPage(2);//上页
          //console.log(prev)
          prev.loadOnePage2();
        } else {
          wx.showToast({
            title: req.msg,
            icon: 'none'
          })
        }
      })
    } 
  },

  telput: function (e) {
    console.log(e.currentTarget.dataset.fdphone)
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.fdphone
    })
  },

  nav: function(e){
    var address = e.currentTarget.dataset.toaddress;
    var gpsLat = e.currentTarget.dataset.lat;
    var gpsLon = e.currentTarget.dataset.lon;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude //当前位置的经纬度
        var longitude = res.longitude
        wx.openLocation({
          latitude: parseFloat(gpsLat),
          longitude: parseFloat(gpsLon),
          name: address,
          scale: 18
        })
      }
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

  telKF: function(){
    wx.makePhoneCall({
      phoneNumber: '89019298',
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
    wx.showLoading({
      title: '正在刷新',
    })
    var business_deal_id = this.data.dealId;
    this.load(business_deal_id);
    util.initData();
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