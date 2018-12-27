// pages/My_activity/activity_refund/activity_refund.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    active: 0,
    steps: [
      {
        text: '确认退费金额  '
      },
      // {
      //   text: '短信验证'
      // },
      {
        text: '提交退费'
      }
    ],
    order:{},
    activity_order_id:''
  },
  onLoad: function (options) {
    var activity_order_id = options.id;
    this.setData({
      activity_order_id: activity_order_id
    });
    this.getData();
  },
  // bindOne_btn: function () {
  //   this.setData({
  //     active: 1
  //   })
  // },
  // bindTwo_btn: function () {
  //   this.setData({
  //     active: 2
  //   })
  // },
  onShow: function () {

  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/apply_refund',
      method: 'GET',
      data: { id: this.data.activity_order_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            order: data.order
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  async bindBtnCash() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/sub_refund',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { unique_id: '', id: this.data.activity_order_id, token: await app.get_usertoken()},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            active: 2
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
        wx.hideLoading();
      }
    })
  }
})