// pages/My_content/refun_change_content/refun_change_content.js
const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    question_content_index: '',
    question_content: ['七天无理由退货', '商品有瑕疵'],
    order_type:'',
    order_id:'',
    orderDetail:'',
    reason: '',
    uploadimg_list: []
  },
  onLoad: function (options) {
    this.setData({
      order_type:options.type||1,
      order_id:options.id ||402
    })
    this.getData();
  },
  bindContent(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  async submitOrder() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var uploadimg_list = that.data.uploadimg_list;
    var data = { 
      token: await app.get_usertoken(), 
      order_sn: this.data.orderDetail.order_sn, 
      order_id: this.data.order_id, 
      type: this.data.order_type, 
      reason: this.data.reason 
    };
    for (var i in uploadimg_list) {
      data['imgs[' + i + ']'] = uploadimg_list[i];
    }
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/return_goods',
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
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getOrderDetail',
      method: 'GET',
      data: { token: await app.get_usertoken(), id: this.data.order_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            orderDetail: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  bindClose(e) {
    var uploadimg_list = this.data.uploadimg_list;
    uploadimg_list.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      uploadimg_list: uploadimg_list
    })
  },
  bindChoose() {
    var that = this;
    if (this.data.uploadimg_list.length > 8){
      app.showToast('none','最多上传9张图片');
      return false;
    }
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
  bindQuestionChange: function (e) {
    this.setData({
      question_content_index: e.detail.value
    })
  }
})