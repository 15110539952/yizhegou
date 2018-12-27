// pages/Shop_process/store_detail/store_detail.js
const regeneratorRuntime = require('../../../utils/runtime.js');
var app = getApp();
Page({
  data: {
    store_id:'',
    store_detail:'',
    imgUrls: [],
    is_collection: 0
  },
  onLoad: function (options) {
    var store_id = options.id || 2;
    this.setData({
      store_id: store_id
    });
    this.getData();
  },
  bindCollect:async function () {
    var that = this;
    var is_collection = this.data.is_collection;
    var store_id = this.data.store_id;
    var data = { store_id: store_id, type: is_collection, token: await app.get_usertoken() };
    wx.request({
      url: app.publicFuc.yizhegou_url + 'store/collectStoreOrNo',
      method: 'GET',
      data: data,
      success(res) {
        if (res.data.status > 0) {
          if (!is_collection) {
            console.log(1)
            that.setData({
              is_collection: 1
            })
            app.showToast('success', '收藏成功');
          } else {
            console.log(0)
            that.setData({
              is_collection: 0
            })
            app.showToast('success', '取消收藏成功');
          }
        }
      }
    })
  },
  getData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Store/index',
      method: 'GET',
      data: { store_id: this.data.store_id},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          app.changeTitle(data.store_name);
          var imgUrls = data.store_slide?data.store_slide.split(','):[];
          that.setData({
            store_detail: data,
            imgUrls: imgUrls
          })
        }
      },
      complete(){
        wx.hideLoading();
      }
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})