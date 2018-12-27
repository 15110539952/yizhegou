// pages/me/me.js
const regeneratorRuntime = require('../../utils/runtime.js');
const app = getApp();
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    userInfo:{}
  },
  onLoad: function (options) {
    // this.getData();
  },
  onShow: function () {
    this.getData();
  }, 
  bindSetting(e){
    var is_phone = e.currentTarget.dataset.is_phone;
    if(is_phone){
      wx.navigateTo({
        url: '/pages/My_content/user_info/user_info',
      })
    }else{
      wx.navigateTo({
        url: '/pages/My_content/real_name/real_name',
      })
    }
  },
  bindActivityTab: function (e) {
    var tab = e.currentTarget.dataset.tab;
    app.globalData.activity_tab = tab || 0;
    wx.switchTab({
      url: '/pages/My_activity/my_activity/my_activity'
    })
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/userInfo',
      method: 'GET',
      data: { token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            userInfo: data,
          })
        }
      },
      complete(res) {
        wx.hideLoading();
        // app.showToast('none', res.data.msg);
      }
    })
  },
  getUserInfo() {
    wx.getUserInfo({
      success(res) {
        wx.navigateTo({
          url: '/pages/My_content/real_name/real_name?change=1'
        })
        // const userInfo = res.userInfo
        // const avatarUrl = userInfo.avatarUrl
      }
    })
  }
})