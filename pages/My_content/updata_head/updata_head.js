// pages/me/updata_head/updata_head.js
const app = getApp();
import WeCropper from '../../../commentJs/we-cropper.min.js'
const regeneratorRuntime = require('../../../utils/runtime.js');
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  async getCropperImage() {
    var token = await app.get_usertoken();
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        console.log(avatar); 
        wx.getFileSystemManager().readFile({
          filePath: avatar, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log('data:image/png;base64,' + res.data);
            wx.request({
              url: app.publicFuc.yizhegou_url + 'user/updateUserHeadPic',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: { 'token': token, head_pic: 'data:image/png;base64,' + res.data },
              success: function (res) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 1000);
                  }
                });
              },
              fail: function (res) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                });
              },
              complete(res) {
                app.showToast('none', res.data.msg);
              }
            })
          }
        })
        //  获取到裁剪后的图片
        // wx.uploadFile({
        //   url: app.publicFuc.yizhegou_url + 'User/updatehead',
        //   filePath: avatar,
        //   name: 'head_pic',
        //   formData: {
        //     'token': token
        //   },
        //   success: function (res) {
        //     wx.showToast({
        //       title: '上传成功',
        //       icon:'success',
        //       success:function(){
        //         setTimeout(function () {
        //           wx.navigateBack({
        //             delta: 1,
        //           })
        //         },1000);
        //       }
        //     });
        //   },
        //   fail:function(res){
        //     wx.showToast({
        //       title: '上传失败',
        //       icon:'none'
        //     });
        //   }
        // });
      } else {
        app.showToast('none', '获取图片失败，请稍后重试');
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        console.log(src);
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    const { cropperOpt } = this.data

    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          // console.log(`before picture loaded, i can do something`)
          // console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          // console.log(`picture loaded`)
          // console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          // console.log(`before canvas draw,i can do something`)
          // console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})
