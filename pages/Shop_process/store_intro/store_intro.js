// pages/Shop_process/store_intro/store_intro.js
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    store_id:'',
  },
  onLoad: function (options) {
    var store_id = options.id;
    this.setData({
      store_id: store_id
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
      url: app.publicFuc.yizhegou_url + 'Store/about',
      method: 'GET',
      data: { store_id: this.data.store_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          app.changeTitle(data.store_name);
          WxParse.wxParse('store_content', 'html', data.store_zy, that, 5);
        }
      },
      complete(){
        wx.hideLoading();
      }
    })
  },
  onReachBottom: function () {

  },
})