// pages/My_content/express_info/express_info.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    order_id: '',
    order_sn: '',
    logistics_num: '',
    logistics_type: '',
    steps: [
      {
        text: '等待商家发货',
        // desc: '2018-08-31 18:20'
      },
    ]
  },
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id
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
      url: app.publicFuc.yizhegou_url + 'user/logisticsQuery',
      method: 'GET',
      data: { token: await app.get_usertoken(), id: this.data.order_id },
      success(res) {
        if (res.data.status > 0) {
          var logistics = res.data.result.logistics;
          that.setData({
            order_sn: res.data.result.order_sn
          })
          if (logistics.result){
            that.setData({
              logistics_num: logistics.result.number,
              logistics_type: logistics.result.type
            })
            var steps = [];
            for (var key in logistics.result.list) {
              steps.push({ text: logistics.result.list[key].status, desc: logistics.result.list[key].time })
            }
            that.setData({
              steps: steps
            })
          }
          if (logistics.msg != 'ok'){
            that.setData({
              steps: [{ text: logistics.msg}]
            })
          }
        }else{
          app.showToast('none', res.data.msg)
        }
      },
      complete(res) {
        app.showToast('none', res.data.result.logistics.msg)
      }
    })
  },
})