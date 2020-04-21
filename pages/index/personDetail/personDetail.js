var util = require('../../../utils/util.js');

Page({

  data: {

  },

  onLoad: function (options) {
    console.log(options.personId)
    var _this = this
    util.req("index/getHelperDetail", {id: options.personId}, function (res) {
      if (res.code == "0") {
        _this.setData({
          pageImage: res.data.page_image,
          users_id: res.data.users_id,
          helper_name: res.data.name,
          title_l: '我的资源',
          title_r: '点击下方资源内容可快速生成订单哦',
          resources: res.data.resources
        })
        if (res.data.resources.length %3 !=0){
          _this.setData({
            isShow: true
          })
        }else{
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
          title: ''+tag+'-'+name
        })
      } 
    })
  },

  //生成订单
  generateOrder: function(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }

})