// pages/My_content/user_info/user_info.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    userInfo: {},
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.getData();
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/userInfo',
      method: 'GET',
      data: { token: await app.get_usertoken()},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            userInfo: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  upload() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: '/pages/My_content/updata_head/updata_head?src='+src
        })
      }
    })
  },
  getUserInfo() {
    wx.getUserInfo({
      success(res) {
        wx.navigateTo({
          url: '/pages/My_content/real_name/real_name'
        })
        // const userInfo = res.userInfo
        // const avatarUrl = userInfo.avatarUrl
      }
    })
  }
})