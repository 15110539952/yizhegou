// pages/My_activity/activity_ranking/activity_ranking.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
Page({
  data: {
    ranking: '',
    activity_id: ''
  },
  onLoad: function (options) {
    this.setData({
      activity_id: options.id
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
      url: app.publicFuc.yizhegou_url + 'activity/activity_result',
      method: 'GET',
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            ranking: data
          })
          app.changeTitle('第' + data.activity.period_num +'期用户名单');
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  }
})