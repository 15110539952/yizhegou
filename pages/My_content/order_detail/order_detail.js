// pages/My_content/order_detail/order_detail.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
var app = getApp();
Page({
  data: {
    order_id:'',
    orderDetail: ''
  },
  onLoad: function (options) {
    this.setData({
      order_id:options.id
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
      url: app.publicFuc.yizhegou_url + 'user/getOrderDetail',
      method: 'GET',
      data: { id: this.data.order_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          data.add_time = commentJs.formatDate(new Date(data.add_time * 1000),'yyyy-dd-MM hh:mm');
          data.shipping_time = commentJs.formatDate(new Date(data.shipping_time * 1000),'yyyy-dd-MM hh:mm');
          that.setData({
            orderDetail: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  }
})