// pages/Shop_process/pay_success/pay_success.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
Page({
  data: {
    order_id:'',
    userInfo:'',
    is_container: true
  },
  onLoad: function (options) {
    this.setData({
      order_id: options.id
    })
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
      data: { token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            userInfo: data,
            is_container: false
          })
        }
        wx.hideLoading();
      },
      fail(res) {
        wx.hideLoading();
      }
    })
  },
})