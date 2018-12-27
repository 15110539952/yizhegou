// pages/My_content/writing_evaluation/writing_evaluation.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
var app = getApp();
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    activity_id: '',
    order_id: '',
    rank: 0,
    content: '',
    uploadimg_list:[]
    // tempFilePaths:[]//临时图片数组
  },
  onLoad: function (options) {
    this.setData({
      activity_id: options.activity_id,
      order_id: options.order_id,
    })
  },
  bindRank(e){
    this.setData({
      rank: e.detail.index
    })
  },
  bindContent(e){
    this.setData({
      content:e.detail.value
    })
  },
  bindClose(e){
    var uploadimg_list = this.data.uploadimg_list;
    uploadimg_list.splice(e.currentTarget.dataset.index,1);
    this.setData({
      uploadimg_list: uploadimg_list
    })
  },
  async submitOrder() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var uploadimg_list = that.data.uploadimg_list;
    var data = { token: await app.get_usertoken(), activity_id: this.data.activity_id, order_id: this.data.order_id, rank: this.data.rank, content: this.data.content };
    for (var i in uploadimg_list) {
      data['imgs[' + i + ']'] = uploadimg_list[i];
    }
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/add_comment',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          wx.redirectTo({
            url: '/pages/My_content/my_order/my_order'
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  // bindChoose(){
  //   var that = this;
  //   var tempFilePaths = this.data.tempFilePaths;
  //   wx.chooseImage({
  //     success: function (res) {
  //       let tempFilePath = res.tempFilePaths;//这里是选好的图片的地址，是一个数组
  //       tempFilePaths = tempFilePaths.concat(tempFilePath)
  //       that.setData({
  //         tempFilePaths: tempFilePaths
  //       })
  //     }
  //   })
  // },
  bindChoose() {
    var that = this;
    // var tempFilePaths = this.data.tempFilePaths;
    wx.chooseImage({
      sizeType: 'compressed',
      success: async function (res) {
        let tempFilePath = res.tempFilePaths;//这里是选好的图片的地址，是一个数组
        var token = await app.get_usertoken();
        for (let i in tempFilePath) {
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.uploadFile({
            url: app.publicFuc.yizhegou_url + 'user/uploadimg',
            filePath: tempFilePath[i],
            name: 'img_file[]',
            formData: { token: token },
            success(res) {
              var jsonStr = res.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                res.data = jj;
              }
              var data = res.data;
              // console.log(data);
              if (data.status > 0) {
                let uploadimg_list = that.data.uploadimg_list;
                uploadimg_list = uploadimg_list.concat(data.result);
                that.setData({
                  uploadimg_list: uploadimg_list
                })
              }
            },
            complete(res) {
              app.showToast('none', res.data.msg);
            }
          })
        }
      }
    })
  },
})