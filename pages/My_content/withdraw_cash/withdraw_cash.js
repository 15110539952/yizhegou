// pages/My_content/withdraw_cash/withdraw_cash.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
Page({
  data: {
    active: 0,
    steps: [
      {
        text: '设置提现金额'
      },
      {
        text: '短信验证'
      },
      {
        text: '提交审核'
      }
    ],
    user_money:'',
    distribut_min:'',
    money: '',
    code: '',
    mobile:'',
    is_verif: false,
    verif_text: '发送验证码'
  },
  onLoad: function (options) {
    this.setData({
      mobile: options.mobile,
    });
    this.getData();
  },
  bindOne_btn: function () {
    var money = this.data.money;
    var distribut_min = this.data.distribut_min;
    if (distribut_min) {
      app.showToast('none', '最低提现金额为:' + distribut_min + '元');
      return false;
    }
    var that = this;
    setTimeout(function(){
      if (money > 0) {
        that.setData({
          active: 1
        })
      }
    },500)
  },
  async getData(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/withdrawals_money',
      method: 'GET',
      data: { token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            user_money: data.user_money,
            distribut_min: data.distribut_min || 0,
          });
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  async bindBtnCash() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/withdrawals',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {token: await app.get_usertoken(), money: this.data.money, code: this.data.code, unique_id: wx.getStorageSync('unique_id')},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            active: 2
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  bindBackpage: function () {
    this.setData({
      active: 0
    })
  },
  bindInputBlur(){
    var money = this.data.money;
    var user_money = this.data.user_money;
    if (money > user_money){
      money = user_money;
      app.showToast('success', '最多可提现 ' + user_money);
    }
    this.setData({
      money: money
    })
  },
  bindInputchange(e) {
    var name = e.currentTarget.dataset.name;
    var value = parseFloat(e.detail);
    if (name == 'money') {
      value = value.toFixed(2);
      this.setData({
        money: value
      })
    }
    if (name == 'code') {
      this.setData({
        code: value
      })
    }
  },
  bindCode() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/send_sms_code',
      method: 'GET',
      data: { mobile: this.data.mobile, unique_id: wx.getStorageSync('unique_id') },
      success(res) {
        if (res.data.status > 0) {
          // that.setData({
          //   code: res.data.code
          // })
          console.log(res.data.code);
          that.setData({
            disabled_verif: true,
            verif_text: '60后获取'
          });
          that.setData({
            is_verif: true
          });
          var s = 60;
          var time = setInterval(function () {
            that.setData({
              disabled_verif: true,
              verif_text: s + 's后获取'
            });
            if (s == 1) {
              clearInterval(time);
              that.setData({
                disabled_verif: false,
                verif_text: '重新获取'
              });
              return false;
            }
            s--;
          }, 1000);
        } else {
          that.setData({
            disabled_verif: false,
            verif_text: '重新获取'
          });
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  }
})