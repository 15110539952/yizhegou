// pages/My_content/perfect_info/perfect_info.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
Page({
  data: {
    xieyi:false,
    nickname:'',
    realname:'',
    mobile:'',
    code: '',
    is_verif: false,
    verif_text: '发送验证码'
  },
  onLoad: function (options) {
    this.getData();
  },
  bindXieyi: function () {
    this.setData({
      xieyi: !this.data.xieyi
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
            nickname: data.nickname,
            realname: data.realname,
            mobile: data.mobile,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  async bindPerfect() {
    if (!this.data.xieyi) {
      app.showToast('none', '请同意用户服务协议');
      return false
    }
    if (!commentJs.is_phone(this.data.mobile)) {
      app.showToast('none', '手机号不正确')
      return false
    }
    if (!this.data.code) {
      app.showToast('none', '请输入验证码');
      return false
    }
    if (!this.data.nickname) {
      app.showToast('none', '请输入昵称');
      return false
    }
    if (!this.data.realname) {
      app.showToast('none', '请输入姓名');
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/updateUserInfo1',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { token: await app.get_usertoken(), mobile: this.data.mobile, nickname: this.data.nickname, realname: this.data.realname, code: this.data.code, unique_id: wx.getStorageSync('unique_id') },
      success(res) {
        if (res.data.status > 0) {
          wx.redirectTo({
            url: '/pages/My_content/real_name/real_name',
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  bindCode() {
    var mobile = this.data.mobile;
    if (!commentJs.is_phone(mobile)) {
      app.showToast('none', '手机号不正确')
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
      data: { mobile: mobile, unique_id: wx.getStorageSync('unique_id') },
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
  },
  bindInputchange(e) {
    var name = e.currentTarget.dataset.name;
    var value = e.detail;
    if (name == 'nickname') {
      this.setData({
        nickname: value
      })
    }
    if (name == 'realname') {
      this.setData({
        realname: value
      })
    }
    if (name == 'mobile') {
      this.setData({
        mobile: value
      })
    }
    if (name == 'code') {
      this.setData({
        code: value
      })
    }
  },
})