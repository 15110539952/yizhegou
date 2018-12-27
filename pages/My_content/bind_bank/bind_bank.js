// pages/My_content/bind_bank/bind_bank.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
Page({
  data: {
    id:'',
    active:0,
    open_bank: '',
    bank_name: '',
    card_num: '',
    account_name: '',
    phone: '',
    code: '',
    is_verif: false,
    verif_text:'发送验证码'
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || ''
    })
  },
  bindOne_btn: function () {
    if (!this.data.card_num || !this.data.account_name){
      app.showToast('none','请完善信息');
      return false;
    }
    this.setData({
      active:1
    })
  },
  bindTwo_btn(){
    this.setData({
      active: 0
    })
  },
  bindInputchange(e){
    var name = e.currentTarget.dataset.name;
    var value = e.detail;
    if (name == 'open_bank'){
      this.setData({
        open_bank: value
      })
    }
    if (name == 'bank_name'){
      this.setData({
        bank_name: value
      })
    }
    if (name == 'card_num') {
      this.setData({
        card_num: value
      })
    }
    if (name == 'account_name') {
      this.setData({
        account_name: value
      })
    }
    if (name == 'code') {
      this.setData({
        code: value
      })
    }
    if (name == 'phone') {
      this.setData({
        phone: value
      })
    }
  },
  async bindBank() {
    if (!commentJs.is_phone(this.data.phone)) {
      app.showToast('none', '手机号不正确')
      return false
    }
    if (!this.data.code) {
      app.showToast('none', '请输入验证码');
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/bindCard',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { id: this.data.id, token: await app.get_usertoken(), open_bank: this.data.open_bank,bank_name: this.data.bank_name, card_num: this.data.card_num, account_name: this.data.account_name, code: this.data.code, mobile: this.data.phone, unique_id: wx.getStorageSync('unique_id')},
      success(res) {
        if (res.data.status > 0) {
          wx.navigateBack({
            delta: 1,
          });
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  bindCode(){
    var phone = this.data.phone;
    if (!commentJs.is_phone(phone)){
      app.showToast('none','手机号不正确')
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/send_sms_code',
      method: 'GET',
      data: { mobile: phone, unique_id: wx.getStorageSync('unique_id')},
      success(res) {
        if (res.data.status > 0) {
          // that.setData({
          //   code: res.data.code
          // })
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