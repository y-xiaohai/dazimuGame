var util = require('../../../utils/util.js');

Page({

  data: {
    head_images: [],
    showDialog: false,//弹窗是否显示
  },

  onLoad: function (options) {
    console.log("匠人ID编号: " + options.personId)
    var _this = this
    util.req("index/getHelperDetail", { id: options.personId }, function (res) {
      if (res.code == "0") {
        var tag = res.data.index_tag + '/' + res.data.remark
        _this.setData({
          head_images: res.data.head_images,
          head_video: res.data.head_video,
          users_id: res.data.users_id,
          helper_img: res.data.gd_image,
          helper_name: res.data.name,
          drawing: res.data.drawing,
          pageImage: res.data.page_image,
          tag: tag,
          content: res.data.content,
          address: res.data.address,
          lookMore: '查看全部介绍',
          title_l: '我的资源',
          title_r: '点击下方资源内容可快速生成订单哦',
          resources: res.data.resources
        })
        if (res.data.resources.length % 3 != 0) {
          _this.setData({
            isShow: true
          })
        } else {
          _this.setData({
            isShow: false
          })
        }
        // if (res.data.users_id == 97){
        //   _this.setData({
        //     color: 'color1'
        //   })
        // }else{
        //   _this.setData({
        //     color: 'color2'
        //   })
        // }
        var tag = res.data.index_tag
        var name = res.data.name
        wx.setNavigationBarTitle({
          title: '' + tag + '-' + name
        })
      }
    })
  },

  //点击预览图片
  previewImg: function (e) {
    var current = e.currentTarget.dataset.ur
    wx.previewImage({
      urls: this.data.head_images,
      current: current,
      success: function (e) {
        console.log('预览成功')
      }
    })
  },

//查看更多的弹窗
  lookMore: function (e) {
    var that = this
    that.setData({
      showDialog: true,
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

  //生成订单
  generateOrder: function (e) {
    console.log(e)
    var helperId = e.currentTarget.dataset.helperid;
    var image = e.currentTarget.dataset.image;
    var classId = e.currentTarget.dataset.classid;
    var price = e.currentTarget.dataset.price;
    var msg = e.currentTarget.dataset.msg;
    var resouId = e.currentTarget.dataset.resouid;
    var usersId = e.currentTarget.dataset.usersid;
    var helperName = e.currentTarget.dataset.helpername;
    if (helperId == "5" || helperId == "15"){
      wx.navigateTo({
        url: '/pages/index/LXYGenerateOrder/LXYGenerateOrder?image=' + image + '&classId=' + classId + '&price=' + price + '&msg=' + msg + '&resou_id=' + resouId + '&helper_id=' + helperId + '&users_id=' + usersId + '&helper_name=' + helperName
      })
    }else{
      wx.navigateTo({
        url: '/pages/index/GenerateOrder/GenerateOrder?image=' + image + '&classId=' + classId + '&price=' + price + '&msg=' + msg + '&resou_id=' + resouId + '&helper_id=' + helperId + '&users_id=' + usersId + '&helper_name=' + helperName
      })
    }  
  }

})