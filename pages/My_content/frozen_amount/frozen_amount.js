// pages/My_content/frozen_amount/frozen_amount.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    price:'',
    activity_frozen:[]
  },
  onLoad(options){
    this.setData({
      price:options.price
    })
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
      url: app.publicFuc.yizhegou_url + 'user/activity_frozen',
      method: 'GET',
      data: { token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          for (var i in data) {
            let addAmount = parseFloat(data[i].shipping_price) + parseFloat(data[i].activity_price);
            data[i].addAmount = addAmount.toFixed(2);
            data[i].add_time = commentJs.formatDate(new Date(data[i].add_time * 1000), 'yyyy-dd-MM hh:mm');
          }
          that.setData({
            activity_frozen: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
})