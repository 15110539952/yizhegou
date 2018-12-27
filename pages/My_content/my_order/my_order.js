// pages/My_content/my_order/my_order.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    screenHeight:'',
    active: 0,
    page: 1,
    orderAll:[
      { page: 1, is_bottom: false, order_list:[],order_type: ''},
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCONFIRM'},
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITSEND'},
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCASH'},
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCCOMMENT'},
      { page: 1, is_bottom: false, order_list: [], order_type: 'FINISH'},
    ],
    order_type:''
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight-45
        });
      }
    });
    this.getData();
  },
  onChange(e) {
    var index = e.detail.index;
    this.setData({active:index});
    // var data = this.data.orderAll[index];
    // if (data.is_bottom){return false}
    var orderAll = this.data.orderAll;
    orderAll[index].page = 1;
    orderAll[index].is_bottom = false;
    orderAll[index].order_list = [];
    this.setData({
      orderAll: orderAll
    })
    // if(data.page == 1){
      this.getData();
    // }
  },
  onPullDownRefresh: function () {
    orderAll: [
      { page: 1, is_bottom: false, order_list: [], order_type: '' },
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCONFIRM' },
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITSEND' },
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCASH' },
      { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCCOMMENT' },
      { page: 1, is_bottom: false, order_list: [], order_type: 'FINISH' },
    ],
    this.setData({
      orderAll: orderAll
    })
    this.getData();
  },
  bindAllscroll: function () {
    var data = this.data.orderAll[this.data.active];
    if (data.is_bottom) { return false }
    this.getData();
  },
  async bindConfirm(e){
    var order_id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/receive_goods',
      method: 'GET',
      data: { token: await app.get_usertoken(), order_id: order_id },
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            page: 1,
            orderAll: [
              { page: 1, is_bottom: false, order_list: [], order_type: '' },
              { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCONFIRM' },
              { page: 1, is_bottom: false, order_list: [], order_type: 'WAITSEND' },
              { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCASH' },
              { page: 1, is_bottom: false, order_list: [], order_type: 'WAITCCOMMENT' },
              { page: 1, is_bottom: false, order_list: [], order_type: 'FINISH' },
            ],
            order_type: ''
          })
          that.getData();
        }
      },
      complete(res) {
        app.showToast('none',res.data.msg);
      }
    })
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var active = this.data.active;
    var data = this.data.orderAll[active];
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getOrderList',
      method: 'GET',
      data: { p: data.page, token: await app.get_usertoken(), type: data.order_type},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var orderAll = that.data.orderAll;
          if (!data.length){
            orderAll[active].is_bottom = true;
            that.setData({
              orderAll: orderAll
            })
            return false;
          }
          orderAll[active].order_list = orderAll[active].order_list.concat(data);
          orderAll[active].page = orderAll[active].page += 1;
          that.setData({
            orderAll: orderAll,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  pullEvaluation(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var activity_id = e.currentTarget.dataset.activity_id;
    wx.navigateTo({
      url: `/pages/My_content/writing_evaluation/writing_evaluation?order_id=${order_id}&activity_id=${activity_id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  seeEvaluation(e) {
    var activity_id = e.currentTarget.dataset.activity_id;
    wx.navigateTo({
      url: `/pages/Shop_process/shop_evaluate/shop_evaluate?id=${activity_id}`,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  customerService(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var activity_id = e.currentTarget.dataset.activity_id;
    wx.navigateTo({
      url: `/pages/My_content/refun_change_goods/refun_change_goods?order_id=${order_id}&activity_id=${activity_id}`,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})