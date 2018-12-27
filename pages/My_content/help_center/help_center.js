// pages/My_content/help_center/help_center.js
const app = getApp();
const WxParse = require('../../../wxParse/html2json.js');
Page({
  data: {
    screenHeight: '',
    tabbar_active:'0',
    helpCat:[],
    helpList:[],
    page: 1,
    cat_id: 0
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight - 75
        });
      }
    });
    this.getData();
  },
  bindTabbar(e){
    var index = e.currentTarget.dataset.index;
    if (index == this.data.tabbar_active){return false}
    this.setData({
      cat_id: this.data.helpCat[index].cat_id,
      tabbar_active: index,
      helpList:[],
      page:1
    })
    this.getDataList();
  },
  getData(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'article/helpCat',
      method: 'GET',
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          for (let i in data){
            data[i].color = false;
          }
          data[0].color = true;
          that.setData({
            helpCat: data,
            cat_id: data[0].cat_id
          })
          that.getDataList();
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  getDataList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'article/helpList',
      method: 'GET',
      data: { cat_id: this.data.cat_id, p:this.data.page},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          for(var i in data){
            let item = data[i];
            item.content = WxParse.html2json(item.content, 'returnData'); 
          }
          that.setData({
            helpList: data,
            page: that.data.page += 1
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  }
})