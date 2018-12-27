// pages/My_activity/activity_detail/activity_detail.js
const app = getApp();
const commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    activity_id:'',
    activityDetail: {},
    myHour: '',
    myMinite: '',
    mySecond: '',
    task_id:0,
    Sharephoto:''
  },
  onLoad: function (options) {
    this.setData({
      activity_id: options.id
    })
    this.getData();
  },
  onReady: function () {

  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/activity_detail',
      method: 'GET',
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          for (var i in data.task){
            data.task[i].is_switch = false;
            if (data.activity_status < 3){
              that.getShareImg(data.task[i].id, i);
            }
          }
          that.setData({
            activityDetail: data
          })
          that.getTaskData();//获取基础任务详情说明
          // that.onSharePhoto();//绘制分享图片
          commentJs.countdowm(that, data.base_task.end_time);
          // for (var i = 0; i < data.task.length; i++) {
          //   data.task[i].end_time = commentJs.countdowm(data.task[i], true, data,i);
          // }
        }else{
          app.showToast('none', res.data.msg)
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },


  async getTaskData(e) {//获取任务详情 切换任务分享显示
    var activityDetail = this.data.activityDetail;
    var task_id = 0;
    if (activityDetail.activity_status>3){
      // return false;
    }
    if(e){
      var index = e.currentTarget.dataset.index;
      task_id = e.currentTarget.dataset.id;
      if (task_id == 0){
        activityDetail.base_task.taskDetail.is_switch = !activityDetail.base_task.taskDetail.is_switch;
        this.setData({
          activityDetail: activityDetail
        })
        return false;
      }else{
          activityDetail.task[index].is_switch = !activityDetail.task[index].is_switch;
          this.setData({
            activityDetail: activityDetail
          })
          return false;
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/task_detail',
      method: 'GET',
      data: { activity_id: this.data.activity_id, task_id: task_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          commentJs.countdowm(that, data.end_time);
          if (task_id == 0){
            activityDetail.base_task.taskDetail = data;
            activityDetail.base_task.taskDetail.is_switch = true;
            that.getShareImg(task_id, index);
          }else{
            activityDetail.task[index].taskDetail = data;
            activityDetail.task[index].taskDetail.is_switch = true;
          }
          that.setData({
            activityDetail: activityDetail
          })
        } else {
          app.showToast('none', res.data.msg)
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  }, 

  async getShareImg(task_id,index) {//分享图片、code、名字获取
    var activityDetail = this.data.activityDetail;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/shareActivity',
      method: 'GET',
      data: { activity_id: this.data.activity_id, task_id: task_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(task_id == 0){
            activityDetail.base_task.shareData = {
              code: data.code,
              img_url: data.img_url,
              activity_name: data.activity.activity_name
            };
          }else{
            activityDetail.task[index].shareData = {
              code: data.code,
              img_url: data.img_url,
              activity_name: data.activity.activity_name
            };
          }
          that.setData({
            activityDetail: activityDetail
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg)
      }
    })
  },
  bindSaveImg: function (e) {//保存图片
    var index = e.currentTarget.dataset.index;
    var img_url;
    if (index == 'base') {
      img_url = this.data.activityDetail.base_task.shareData.img_url;
    } else {
      img_url = this.data.activityDetail.task[index].shareData.img_url;
    }
    wx.showLoading({
      title: '正在保存...'
    })
    wx.downloadFile({
      url: img_url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.hideLoading();
            wx.showModal({
              title: '已保存图片到相册',
              content: '由于微信限制，请到朋友圈上传图片来分享',
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  
                } 
              }
            })
          },
          fail: function (err) {
            wx.hideLoading();
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.showModal({
                title: '保存图片失败',
                content: '点击确认，设置允许保存到相册',
                success(res) {
                  if (res.confirm) {
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
                }
              })
            }
          },
          complete(res) {
            // console.log(res);
          }
        })
      },
      fail(e){
        app.showToast('none','图片保存失败')
      }
    })
  },
  onShareAppMessage: function (e) {
    var index = 'base';
    if (e.target){
      index = e.target.dataset.index;
    }
    var data;
    if(index == 'base'){
      data = this.data.activityDetail.base_task.shareData;
    }else{
      data = this.data.activityDetail.task[index].shareData;
    }
    let title = '';
    let imageUrl = '';
    let path = '/pages/Shop_process/shop_detail/shop_detail?id=' + this.data.activity_id;
    if(data){
      title = data.activity_name;
      imageUrl = data.img_url;
      path = '/pages/Shop_process/shop_detail/shop_detail?id=' + this.data.activity_id + '&code=' + data.code;
    }
    return {
      title: this.data.activityDetail.activity_name,
      desc: '',
      imageUrl: this.data.activityDetail.original_img,
      path: path
    }
  },
  onSharePhoto() {
    var ctx = wx.createCanvasContext('ShareCanvas');
    var that = this;
    ctx.drawImage(this.data.activityDetail.original_img, 0, 0, 500, 400)
    ctx.draw();
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'ShareCanvas',
        success(res) {
          that.setData({
            Sharephoto: res.tempFilePath
            // Sharephoto: res.tempFilePath.replace(/wxfile:\/\//,'')
          })
        }
      })
    },2000)
  }
})