var base64 = require('../utils/base64.js');

//网址
var yizhegou_url = 'http://192.168.1.200:830/api/';

//客户端名称
var client_name = "android_app";
//客户端密钥
var client_secret = "android_app_password";
// 订单来源
var platform='微信小程序';

//获取token
function getClientToken(login) {
  wx.request({
    url: server_api_url + 'Token',
    data: { grant_type: 'client_credentials' },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: { "Content-Type": "application/x-www-form-urlencoded", authorization: "Basic " + base64.Base64.btoa('android_app' + ":" + 'android_app_password') }, // 设置请求的 header
    success: function (result) {
      // console.log(result);
      wx.setStorageSync('cat', result.data.access_token);
      wx.setStorageSync('cat_expireDate', new Date().getTime() + result.data.expires_in * 1000);
      // wx.navigateBack({
      //   delta: 1
      // });
      if (!login) {
        is_Usertoken();
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '网络异常，请检查您的网络设置！',
        image:'/img/error_icon.png'
      })
    },
    complete: function (res) {
      // complete
    }
  })
}

function getUserinfo(app) {
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  var uat = wx.getStorageSync('uat');
  wx.request({
    url: app.globalData.publicjs.server_api_url + 'user/getUserinfo?access_token=' + uat,
    method: 'GET',
    success: function (res) {
      // console.log(res);
      if (res.data.code == 1) {
        var data = res.data.data;
        var amount = '0.00';
        if (data.amount) {
          amount = data.amount;
        }
        app.globalData.userInfo = { headimgurl: data.headimgurl, nickname: data.nickname, amount: amount };
      } else {
        wx.showToast({
          title: res.data.message,
          image: '/img/warn_icon.png',
        })
      }
    },
    complete: function (res) {
      wx.hideLoading();
    }
  });
}

// 判断token是否有cat
// function is_token(login) {
//     var cat = wx.getStorageSync('cat');
//     var value = wx.getStorageSync('cat_expireDate');
//     var is_token=false;
//     return is_token;
// }
// 判断是否有uat
// function is_Usertoken() {
//     var is_token=false;
//     var uat=wx.getStorageSync('uat');
//     var value = wx.getStorageSync('uat_expireDate');
//     return is_token;
// }

module.exports = {
  yizhegou_url: yizhegou_url
}
