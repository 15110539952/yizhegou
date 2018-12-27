//app.js
const regeneratorRuntime = require('utils/runtime.js');
App({
  onLaunch: function () {
    // this.get_usertoken();
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 获取用户信息
    var that = this;
    // let loginTimer = setInterval(function(){
    //   that.Login();
    // },3500000);
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  changeTitle: function (title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },
  publicFuc:{
    yizhegou_url: 'https://yzg.sxruixuan.com/api/',
    yizhegou_img: 'https://yzg.sxruixuan.com/',
    // yizhegou_url: 'http://39.107.72.160:88/api/',
    // yizhegou_img: 'http://39.107.72.160:88/',
  },
  showToast:function(show_type,title){
    if (show_type == 'success'){
      wx.showToast({
        title: title,
        icon: 'success',
      })
    }
    if (show_type == 'none'){
      wx.showToast({
        title: title||'',
        icon: 'none',
      })
    }
  },
  globalData: {
    address_id: '',
    activity_tab: 0,//我的活动
  }, 
  get_usertoken:async function(){
    var user_token = wx.getStorageSync('user_token');
    var expiration = wx.getStorageSync('expiration');
    if (expiration && user_token) {
      if (new Date().getTime() > expiration) {
        await this.Login();
        return wx.getStorageSync('user_token');
      }else{
        return user_token;
      }
    } else {
      await this.Login();
      return wx.getStorageSync('user_token');
    }
  },
  Login:function(){
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: '正在登陆',
        mask: true
      });
      wx.login({
        success: res => {
          wx.setStorageSync('unique_id', res.code);
          wx.request({
            method: 'GET',
            url: "https://yzg.sxruixuan.com/index.php/WXAPI/User/weixinLogin.html",
            // url: "http://39.107.72.160:88/index.php/WXAPI/User/weixinLogin.html",
            data: { code: res.code },
            success: function (res) {
              if (res.data.status > 0) {
                wx.setStorageSync('user_token', res.data.result.token);
                wx.setStorageSync('expiration', new Date().getTime() + 3000000);
                resolve(res);
              } 
              that.showToast('none',res.data.msg);
            },
            fail:function(){
              reject('error');
              that.showToast('none', '登陆出错,请重新进入');
              wx.clearStorageSync();
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      })
    })
  }
  // get_usertoken: function () {
  //   var user_token = wx.getStorageSync('user_token');
  //   var pages = getCurrentPages();
  //   var expiration = wx.getStorageSync('expiration');
  //   if (expiration && user_token) {
  //     if (new Date().getTime() > expiration) {
  //       this.Login();
  //       if (pages.length > 1) {
  //         pages
  //         wx.switchTab({
  //           url: '/' + pages[0].route,
  //         })
  //       }else{
  //         wx.navigateBack({
  //           delta: 1,
  //         })
  //       }
  //     }else{
  //       return user_token;
  //     }
  //   } else {
  //     this.Login();
  //   }
  //   // if (user_token){
  //   //   return user_token;
  //   // }else{
  //   //   this.Login();
  //   // }
  // },
  // Login:function () {
  //   wx.showLoading({
  //     title: '正在登陆',
  //     mask: true
  //   });
  //   var that = this;
  //   wx.login({
  //     success: res => {
  //       wx.request({
  //         method: 'GET',
  //         url: "http://39.107.72.160:88/index.php/WXAPI/User/weixinLogin.html",
  //         data: { code: res.code },
  //         success: function (res) {
  //           if (res.data.status > 0) {
  //             wx.setStorageSync('user_token', res.data.result.token);
  //             wx.setStorageSync('expiration', new Date().getTime() + 3000000);
  //           } else {
  //             that.Login();
  //           }
  //         },
  //         complete: function () {
  //           wx.hideLoading();
  //         }
  //       })
  //     }
  //   })
  // },
  // get_usertoken: function () {
  //   // return "cfb7147cf28d68ccc8cd3eca6e9e5afc";
  //   var pages = getCurrentPages();
  //   var that = this;
  //   var user_token = wx.getStorageSync('user_token');
  //   var expiration = wx.getStorageSync('expiration');
  //   if (expiration && user_token) {
  //     if (new Date().getTime() > expiration) {
  //       Login();
  //       if (pages.length > 1) {
  //         pages
  //         wx.switchTab({
  //           url: '/' + pages[0].route,
  //         })
  //       }else{
  //         wx.navigateBack({
  //           delta: 1,
  //         })
  //       }
  //     }else{
  //       return user_token;
  //     }
  //   }else{
  //     Login();
  //     if (pages.length > 1) {
  //       pages
  //       wx.switchTab({
  //         url: '/' + pages[0].route,
  //       })
  //     } else {
  //       wx.navigateBack({
  //         delta: 1,
  //       })
  //     }
  //   }
  //   function Login() {
  //     wx.showLoading({
  //       title: '正在登陆',
  //       mask: true
  //     })
  //     // 登录
  //     wx.login({
  //       success: res => {
  //         wx.request({
  //           method: 'GET',
  //           url: "http://39.107.72.160:88/index.php/WXAPI/User/weixinLogin.html",
  //           data: { code: res.code },
  //           success: function (res) {
  //             if (res.data.status>0){
  //               that.user_token = res.data.result.token;
  //               wx.setStorageSync('user_token', res.data.result.token);
  //               wx.setStorageSync('expiration', new Date().getTime() + 3000);
  //             }else{
  //               Login();
  //             }
  //           },
  //           complete:function(){
  //             wx.hideLoading();
  //           }
  //         })
  //       }
  //     })
  //   }
  
  // }
})