var util = require('../../../utils/util.js');

Page({
  data: {
    users_image: 'http://apppic.zomin.cn/Fqkmif--dipmTH39C402TwtRZhtB',
    process_phone: '',
    showDialog: false,//弹窗是否显示
    isfail: false,
    noLogin: false
  },

  onLoad: function (options) {
    // this.load();
  },
  
  load:function(){
    var that = this
    util.tokenReq("mine/getUsersInfo", {}, function (res) {
      if(res.code == 0){  
        that.setData(res.data)
        that.setData({
          isfail: true,
          noLogin: false
        })
        wx.setStorage({
          key: 'user_uniq',
          data: res.data.user_uniq + '',
        })
        console.log(res.data)
        if(res.data.is_server == '0'){
          that.setData({
            visitor: '游客' + util.random(1, 1000000),
          })
        }
        var phoneNum = res.data.login_phone; //获取到数据
        //将手机号码中间4位隐藏
        phoneNum = phoneNum.substring(0, 3)+'****'+phoneNum.substring(7);
        that.setData({
          process_phone: phoneNum
        })
      }else if(res.code == '999'){//token过期或不存在
        that.setData({
          showDialog: true,
          noLogin: true
        })
      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  //编辑资料或登录注册
  editor: function(){
    if (this.data.isfail){
      wx.navigateTo({
        url: '../updateInfo/updateInfo',
      })
    }else{
      this.onConfirm();
    }
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

  //到钱包内页
  toWallet: function(){
    if(!this.data.noLogin){
      wx.navigateTo({
        url: '../wallet/myWallet/myWallet',
      })
    }else{
      this.setData({
        showDialog: true
      })
    }
  },

  //到我的伙伴内页
  toFriend: function () {
    if (!this.data.noLogin) {
      if (this.data.isSystem == "1"){
        wx.navigateTo({
          url: '/pages/my/myPartner/myPartner',
        })
      }else{
        wx.showToast({
          title: '受邀进入系统才能查看哦！',
          icon: 'none',
          duration: 2000
        })
      } 
    } else {
      this.setData({
        showDialog: true
      })
    }
  },

  //到实名认证页
  toRealName: function () {
    var that = this;
    if (!this.data.noLogin) {
      if (that.data.is_server == '0') {
        wx.navigateTo({
          url: '/pages/realName/authentication/authentication',
        })
      } else {
        wx.navigateTo({
          url: '/pages/realName/finish/finish',
        })
      }
    } else {
      this.setData({
        showDialog: true
      })
    }
  },

  //到服务地址
  toAddress: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({
        url: '/pages/address/addressManage/addressManage',
      })
    } else {
      this.setData({
        showDialog: true
      })
    }
  },

  //到运营状态内页
  toBusinessStatus: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({
        url: '/pages/my/businessStatus/businessStatus',
      })
    } else {
      this.setData({
        showDialog: true
      })
    }
  },

  //到邀请内页
  toYaoqing: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({
        url: '../yaoqing/yaoqing',
      })
    } else {
      this.setData({
        showDialog: true
      })
    }
  },

  telKF: function () {
    wx.makePhoneCall({
      phoneNumber: '89019298',
    })
  },

  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新',
    })
    this.load()
    util.initData();
  },

  //生命周期函数--监听页面显示
  onShow: function(){
    this.load();
  }
})

