var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.gpsReq('pub/getAddressListByGps', {}, function (res) {
      // console.log(res.data)
      if (res.code == 0) {
        that.setData({
          city_code: res.data.address_detail.city_code,
          addressDetail: res.data.address_detail,
          nearLists: res.data.near_list
        })
      }
    })
  },

  //获取用户输入的关键字
  handleinput: function (e) {
    this.setData({
      keyWord: e.detail.value
    })
  },

  //根据关键词搜索
  searchAddress: function () {
    var _this = this
    var val = _this.data.keyWord //用户输入的关键字
    _this.setData({
      defaultIsShow: true,
    })
    util.gpsReq("pub/getAddressByKeyword", { 'keyword': _this.data.keyWord, 'city_code': _this.data.city_code }, function (res) {
      //console.log(res.data)
      if(res.code == 0){
        var keyList = res.data
        var arr = [];
        for (var i = 0; i < keyList.length; i++) {
          var obj = {};
          //以关键字拆分后的对象数组
          var pro_name = _this.hilight_word(val, keyList[i].name);
          obj.notProName = keyList[i].name;//未处理的name
          obj.address = keyList[i].address;//将地址放进对象中
          obj.city_code = keyList[i].city_code;
          obj.hx_lon = keyList[i].hx_lon;
          obj.hx_lat = keyList[i].hx_lat;
          obj.distance = keyList[i].distance;
          obj.name = pro_name;
          arr.push(obj)
        }
        console.log(arr)
        _this.setData({
          addressListByKey: arr
        })
      }else{
        wx.showToast({
          title: '未搜索到结果',
          icon: 'none',
          duration:2000
        })
      }
    })
  },

  //重新定位
  againPosition: function () {
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorage({
          key: "gps_lon",
          data: longitude
        })
        wx.setStorage({
          key: "gps_lat",
          data: latitude
        })
        wx.showLoading({
          title: '',
          success: function () {
            _this.onLoad()
          }
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000) 
      },
      fail: function (red) {
        console.log(red)
      }
    })
  },

  returnAddress: function (e) {
    let name = e.currentTarget.dataset.name
    let address = e.currentTarget.dataset.address
    let hx_lon = e.currentTarget.dataset.lon
    let hx_lat = e.currentTarget.dataset.lat
   
    let cityCode = e.currentTarget.dataset.code//后面加的
    var prevPage = util.prevPage(2); //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      name: name,
      address: address,
      hx_lon: hx_lon,
      hx_lat: hx_lat,
      citycode: cityCode
    })
    wx.navigateBack();
  },

  hilight_word: function (key, word) {
    let idx = word.indexOf(key);
    let t = [];
    if (idx > -1) {
      if (idx == 0) {
        t = this.hilight_word(key, word.substr(key.length));
        t.unshift({ key: true, str: key });
        return t;
      }
      if (idx > 0) {
        t = this.hilight_word(key, word.substr(idx));
        t.unshift({ key: false, str: word.substring(0, idx) });
        return t;
      }
    }
    return [{ key: false, str: word }];
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