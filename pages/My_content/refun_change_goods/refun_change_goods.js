// pages/My_content/refun_change_goods/refun_change_goods.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
Page({
  data: {
    token:'',
    order_id:'',
    status:'',
    orderDetail:''
  },
  onLoad: async function (options) {
    var token = await app.get_usertoken();
    this.setData({
      token: token,
      order_id: options.order_id
    })
    this.getData();
  },
 getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getOrderDetail',
      method: 'GET',
      data: { token: this.data.token, id: this.data.order_id},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            orderDetail: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/return_goods_status',
      method: 'GET',
      data: { token: this.data.token, order_id: this.data.order_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            status: data,
          })
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
})