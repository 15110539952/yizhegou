// pages/My_content/bank_list/bank_list.js
var app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    cardData:{}
  },
  onShow(){
    this.getData();
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getCard',
      method: 'GET',
      data: { token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          for (var i in data) {
            var num = 0;
            // let card_num = '622848166035553910'; 
            let card_num = data[i].card_num; 
            card_num = card_num.split('');
            var card_num_arr = [];
            var card_num_join = '';
            for (let i = 0; i < 5; i++) {
              card_num_arr.push(card_num.splice(num, 4))
            }
            console.log(card_num_arr);
            for (let i in card_num_arr) {
              card_num_join += card_num_arr[i].join('') + " ";
            }
            data[i].card_num = card_num_join;
          }
          that.setData({
            cardData: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
})