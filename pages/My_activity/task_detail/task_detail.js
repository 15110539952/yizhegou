// pages/My_activity/task_detail/task_detail.js
const app = getApp();
var commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    num:'',
    activity_id:'',
    task_id:'',
    taskDetail: {},
    myHour: '',
    myMinite: '',
    mySecond: '',
    code: '',
    img_url: '',
    activity_name:''
  },
  onLoad: function (options) {
    this.setData({
      num: options.num,
      task_id: options.task_id,
      activity_id: options.id
    })
    this.getData();
  },
  onShow: function () {

  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/task_detail',
      method: 'GET',
      data: { activity_id: this.data.activity_id, task_id: this.data.task_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          commentJs.countdowm(that, data.end_time);
          that.setData({
            taskDetail: data
          })
        }else{
          app.showToast('none', res.data.msg)
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/shareActivity',
      method: 'GET',
      data: { activity_id: this.data.activity_id, task_id: this.data.task_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;

          that.setData({
            code: data.code,
            // img_url: 'http://39.107.72.160:88/Public/upload/activity/2018/10-03/5bb4a6dd8ad0c.jpg'
            img_url: data.img_url,
            activity_name: data.activity.activity_name
          })
        }
      },
      complete() {
      }
    })
  },
  bindSaveImg:function(){
    wx.downloadFile({
      url: this.data.img_url,
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            app.showToast('success','保存成功');
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    app.showToast('none', '请重新点击保存图片到相册');
                  } else {
                    app.showToast('none', '获取权限失败,无法保存图片到相册');
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.activity_name,
      desc: '',
      imageUrl: this.data.img_url,
      path: '/pages/Shop_process/shop_detail/shop_detail?id=' + this.data.activity_id + '&code=' + this.data.code
    }
  }
})