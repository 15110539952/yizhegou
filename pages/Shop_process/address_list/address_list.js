// pages/Shop_process/address_list/address_list.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    address_list:[]
  },
  onShow: function (options) {
    this.getAddress();
  },
  getAddress: async function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getAddressList',
      method: 'GET',
      data: { token: await app.get_usertoken()},
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            address_list: res.data.result,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  bindSetAddress(e){
    var address_id = e.currentTarget.dataset.id;
    app.globalData.address_id = address_id;
    wx.navigateBack({
      delta: 1,
    })
  }
})