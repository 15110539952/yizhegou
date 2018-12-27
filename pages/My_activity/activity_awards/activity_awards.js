// pages/My_activity/get_awards/get_awards.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    awards_type:'',
    activity:{},
    rank:{},
    reward:{},
    activity_order_id:''
  },
  onLoad: function (options) {
    var awards_type = parseInt(options.type);
    var activity_id = options.id;
    var activity_order_id = options.activity_order_id;
    if(awards_type){
      app.changeTitle('领取活动奖励');
    }else{
      app.changeTitle('申请活动退费');
    }
    this.setData({
      awards_type: awards_type,
      activity_id: activity_id,
      activity_order_id: activity_order_id
    });
    this.getData();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
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
          that.setData({
            activity: data.activity,
            rank: data.rank,
            reward: data.reward
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg)
      }
    })
  }
})