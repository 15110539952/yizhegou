// pages/My_content/merchants/merchants.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    xieyi:false,
    apply_state: 'null',
    seller_name:'',
  },
  onLoad: function (options) {
    this.getData();
  },
  bindJump: function (e) {
    if (!this.data.xieyi){
      app.showToast('none','请先同意用户协议');
      return false;
    }
    var index = e.currentTarget.dataset.index;
    if (index==1) {
      wx.navigateTo({
        url: '/pages/My_content/merchants_business/merchants_business',
      })
    }else{
      wx.navigateTo({
        url: '/pages/My_content/merchants_personal/merchants_personal',
      })
    }
  },
  bindxieyi:function(){
    this.setData({
      xieyi:!this.data.xieyi
    });
  },
  async getData() {//联系人信息获取
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/contact',
      method: 'GET',
      data: { token: await app.get_usertoken(), apply_type: this.data.apply_type },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(!data){return false}
          that.setData({
            apply_state: data.apply_state,
            seller_name: data.seller_name
          })
          if (data.apply_state == 1){
            app.changeTitle('入住状态');
          }
        }
      },
      complete(res) {
        wx.hideLoading();
        // app.showToast('none', res.data.msg);
      }
    })
  }
})