var util = require('../../../utils/util.js');
var qiniuUploader = require('../../../utils/qiniuUploader.js');

Page({

  data: {
    users_image: 'http://apppic.zomin.cn/Fqkmif--dipmTH39C402TwtRZhtB',
    process_phone: "",//处理后的手机号码
    "items": [{ name: "1", value: "男士" }, { name: "2", value: "女士" }]
  },

  load: function () {
    var that = this
    util.tokenReq("server/serverInfo", {}, function (res) {
      if(res.code == 0){
        that.setData(res.data)
        var phoneNum = res.data.login_phone;
        phoneNum = phoneNum.substring(0, 3)+'****'+phoneNum.substring(7);
        that.setData({
          process_phone: phoneNum
        })
      } else if(res.msg == "请先成为服务者"){
        wx.showModal({
          title: '',
          content: '请您先实名认证',
          showCancel: false,
          confirmText: '好的',
          success: function(re) {
            if (re.confirm) {
              wx.redirectTo({
                url: '/pages/realName/authentication/authentication'
              })
            } else if (re.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  //更新图像
  changeUserImg: function () {
    var that = this;
    util.initQiniu();
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          console.log(res)
          util.tokenReq("mine/updateUsersInfo", {
            users_image: res.imageURL
          }, function (res) {
            console.log(res)
            if(res.code == 0){
              wx.showToast({
                title: '修改成功',
              })
              that.onLoad();
            }
          })
        }, (error) => {
          // console.error('error: ' + JSON.stringify(error));
        },
          null,
          (progress) => {
            console.log('上传进度', progress.progress)
            console.log('已经上传的数据长度', progress.totalBytesSent)
            console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
          }, cancelTask => that.setData({ cancelTask })
        );
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load();
    util.getQiniuToken();
  }
  
})