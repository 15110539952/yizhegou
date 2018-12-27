// pages/My_content/my_collection/my_collection.js
var app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    screenHeight: '',
    active: 0,
    shop_page: 1,
    store_page: 1,
    shop_more: true,
    store_more: true,
    shop_list:[],
    store_list:[],
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight - 45
        });
      }
    })
    this.getStoreData();
    this.getShopData();
  },
  bindAllscroll: function(e){
    this.setData({
      active: e.detail.index
    })
  },
  bindShopmore() {
    if(this.data.shop_more){
      this.getShopData();
    }
  },
  bindStoremore() {
    if (this.data.store_more) {
      this.getStoreData();
    }
  },
  async getStoreData(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var page = this.data.store_page;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getUserCollectStore',
      method: 'GET',
      data: { token: await app.get_usertoken(), page: page },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(!data.length){
            that.setData({
              store_more:false
            })
            return false;
          }
          var store_list = that.data.store_list.concat(data);
          that.setData({
            store_list: store_list,
            store_page: page += 1
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  async getShopData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var page = this.data.shop_page;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getUserCollectActivity',
      method: 'GET',
      data: { token: await app.get_usertoken(), page: page },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if (!data.length) {
            that.setData({
              shop_more: false
            })
            return false;
          }
          var shop_list = that.data.shop_list.concat(data);
          that.setData({
            shop_list: shop_list,
            shop_page: page += 1
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  }
})