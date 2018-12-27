// pages/Shop_process/winning/winning.js
const app = getApp();
Page({
  data: {
    col_name: 1,
    activity_id:'',
    period_list:[]
  },
  onLoad: function (options) {
    this.setData({
      activity_id: options.id || 20
    })
    this.getData();
  },
  ComponentIcon: function (e) {
    const params = e.detail;
    this.setData({
      col_name: params.name
    })
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const period_list = this.data.period_list;
    if (period_list[index].ranking) {
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/activity_result',
      method: 'GET',
      data: { activity_id: id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          period_list[index].ranking = data.ranking;
          that.setData({
            period_list: period_list
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/past_list',
      method: 'GET',
      data: { activity_id: this.data.activity_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            period_list: data
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
})