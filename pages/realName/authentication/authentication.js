var util = require('../../../utils/util.js');
var qiniuUploader = require('../../../utils/qiniuUploader.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'users_image': "http://apppic.zomin.cn/Fqkmif--dipmTH39C402TwtRZhtB",
    'cardface': "/images/cardface.png",
    'cardback': "/images/cardback.png",
    'camera1': "/images/camera.png",
    'camera2': "/images/camera.png",
    sex: 1, //性别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  handleName: function(e){
    var that = this
    that.setData({
      realName: e.detail.value
    })
  },

  handleCardID: function (e) {
    var that = this
    that.setData({
      cardId: e.detail.value
    })
  },

  //提交
  confirm: function () {
    var that = this;
    util.tokenReq("mine/updateUsersInfo", {
      users_image: that.data.users_image,
      // nickname: that.data.realName,
      sex: that.data.sex
    }, function (res) {
      if(res.code == '0'){
        util.tokenReq("server/setReal", {
          real_name: that.data.realName,
          card_num: that.data.cardId,
          card_image_face: that.data.cardface,
          card_image_back: that.data.cardback
        }, function (req) {
          if (req.code == '0') {
            wx.navigateTo({
              url: '../finish/finish',
            })
          }else{
            wx.showToast({
              title: req.msg,
              icon: 'none'
            })
          }
        })
      }
    })    
  },

 //上传身份证正反面和头像
  uploadCard: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;//获取点击的是正面还是反面的上传
    console.log(currentStatu)
    var that = this;
    var qiniutoken;//获取到的七牛token
    wx.request({
      url: 'https://weixin.zomin.cn/index/pub/getQiniuToken',
      data: {},
      method: "POST",
      header: {
        'x-app-key': '34889c38e2d2293f94af63b30e4106a7',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        qiniutoken = res.data.data.qiniu_token
        var option = {
          region: 'ECN',
          uptoken: qiniutoken,
          domain: 'http://apppic.zomin.cn/',
          shouldUseQiniuFileName: false
        };
        qiniuUploader.init(option);
        if (currentStatu == "userImg") {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              var filePath = res.tempFilePaths[0];
              qiniuUploader.upload(filePath, (res) => {
                console.log(res.imageURL)
                that.setData({
                  'users_image': res.imageURL
                });
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              },
                {
                  region: 'ECN',
                  uptoken: qiniutoken,
                  domain: 'http://apppic.zomin.cn/',
                  shouldUseQiniuFileName: false
                },
                // null,// 可以使用上述参数，或者使用 null 作为参数占位符
                (progress) => {
                  console.log('上传进度', progress.progress)
                  console.log('已经上传的数据长度', progress.totalBytesSent)
                  console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
                },
                //cancelTask => that.setData({ cancelTask })
              );
            }
          })
        }else if (currentStatu == "face") {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              var filePath = res.tempFilePaths[0];
              qiniuUploader.upload(filePath, (res) => {
                console.log(res.imageURL)
                that.setData({
                  'cardface': res.imageURL,
                  'camera1': ''
                });
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              },
                {
                  region: 'ECN',
                  uptoken: qiniutoken,
                  domain: 'http://apppic.zomin.cn/',
                  shouldUseQiniuFileName: false
                },
                // null,// 可以使用上述参数，或者使用 null 作为参数占位符
                (progress) => {
                  console.log('上传进度', progress.progress)
                  console.log('已经上传的数据长度', progress.totalBytesSent)
                  console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
                },
                //cancelTask => that.setData({ cancelTask })
              );
            }
          })
        } else if (currentStatu == "back") {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              var filePath = res.tempFilePaths[0];
              qiniuUploader.upload(filePath, (res) => {
                console.log(res.imageURL)
                that.setData({
                  'cardback': res.imageURL,
                  'camera2': ''
                });
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              },
                {
                  region: 'ECN',
                  uptoken: qiniutoken,
                  domain: 'http://apppic.zomin.cn/',
                  shouldUseQiniuFileName: false,
                },
                // null,// 可以使用上述参数，或者使用 null 作为参数占位符
                (progress) => {
                  console.log('上传进度', progress.progress)
                  console.log('已经上传的数据长度', progress.totalBytesSent)
                  console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
                },
                //cancelTask => that.setData({ cancelTask })
              );
            }
          })
        }
      }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  chooseSexM: function () {
    this.setData({
      sex: 1
    })
  },
  chooseSexF: function () {
    this.setData({
      sex: 2
    })
  },

  // chooseName: function (e) {
  //   this.setData({
  //     focus1: true
  //   })
  // },
  // chooseId: function (e) {
  //   this.setData({
  //     focus2: true
  //   })
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})