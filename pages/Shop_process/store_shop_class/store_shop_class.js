// pages/Shop_process/store_shop_class/store_shop_class.js
var app = getApp();
Page({
  data: {
    store_id:'',
    store_class:[]
  },
  onLoad: function (options) {
    var store_id = options.id;
    var title = options.title;
    this.setData({
      store_id: store_id
    });
    app.changeTitle(title);
    this.getData();
  },
  getData: function () {
    wx.showLoading({
      title:'加载中',
      mask:true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'store/storeGoodsClass',
      method: 'GET',
      data: { store_id: this.data.store_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            store_class: data
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  }
})