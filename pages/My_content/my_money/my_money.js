// pages/My_content/my_money/my_money.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
var app = getApp();
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    moneyDetail: '',
    accountData:[],
    is_bottom: true,
    page: 1,
    token:'',
    userInfo:''
  },
  onLoad:async function (options) {
    this.setData({
      token: await app.get_usertoken()
    })
    this.getData();
    this.getAccountData();
  },
  bindCash: function () {
    var mobile = this.data.userInfo.mobile;
    if (mobile) {
      wx.navigateTo({
        url: '/pages/My_content/withdraw_cash/withdraw_cash?price=' + this.data.moneyDetail.user_money + '&mobile=' + mobile
      })
    } else {
      wx.navigateTo({
        url: '/pages/My_content/real_name/real_name?change=1'
      })
    }
  },
  getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/wallet',
      method: 'GET',
      data: { token: this.data.token },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            moneyDetail: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/userInfo',
      method: 'GET',
      data: { token: this.data.token },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            userInfo: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  async getAccountData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/account_log',
      method: 'GET',
      data: { token: await app.get_usertoken(), p:this.data.page },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(!data.length){
            that.setData({
              is_bottom: false
            })
          }
          for(var i in data){
            data[i].change_time = commentJs.formatDate(new Date(data[i].change_time * 1000), 'yyyy-dd-MM hh:mm');
          }
          var accountData = that.data.accountData;
          accountData = accountData.concat(data);
          that.setData({
            accountData: accountData,
            page: that.data.page +=1
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  onReachBottom: function () {
    if(this.data.is_bottom){
      this.getAccountData();
    }
  }
})