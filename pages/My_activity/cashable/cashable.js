// pages/My_activity/cashable/cashable.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    active: 0,
    steps: [
      {
        text: '确认兑换金额 '
      },
      // {
      //   text: '提交兑换申请'
      // },
      {
        text: '提交成功'
      }
    ],
    reward_price:'',
    reward: {},
    task_id:'',
    cashable:{}
  },
  onLoad: function (options) {
    this.setData({
      task_id: options.task_id,
      activity_id: options.id
    });
    this.getData();
  },
  // bindOne_btn: function () {
  //   this.setData({
  //     active: 2
  //   })
  // },
  // bindTwo_btn: function () {
  //   this.setData({
  //     active: 2
  //   })
  // },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/reward',
      method: 'GET',
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var reward_price = data.reward.activity_price * data.reward.return_multiple;
          reward_price = reward_price.toFixed(2);
          that.setData({
            reward: data.reward,
            reward_price: reward_price
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
      url: app.publicFuc.yizhegou_url + 'activity/cashPrize',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken(), task_id: this.data.task_id},
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
      }
    })
  }
})