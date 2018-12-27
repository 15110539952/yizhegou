// pages/Shop_process/shop_detail/shop_detail.js
var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
var commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  //获取应用实例 
  data: {
    is_container: true,
    guize_show: false,
    shop_tab: 1,
    screenWidth: 0,
    screenHeight:0,
    imgwidth:0,
    imgheight:0,
    imgUrls: [],
    activity: '',
    activity_id:'',
    goods: '',
    goods_attr: '',
    goods_store: [],
    store: '',
    is_collection:0,
    myHour:0,
    myMinite:0,
    mySecond:0,
    is_vavluate: false
  },
  bindShop_tab: function (e) {
    var index = e.target.dataset.index;
    this.setData({
      shop_tab: index
    })
  },
  guizeShow() {
    this.setData({ guize_show: true });
  },
  guizeClose() {
    this.setData({ guize_show: false });
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例
    var viewWidth = 750,           //设置图片显示宽度，
      viewHeight = viewWidth / ratio;    //计算的高度值   
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  bindStore: function () {
    wx.navigateTo({
      url: '/pages/Shop_process/store_detail/store_detail?id=' + this.data.store.store_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  addCart:async function(){
    wx.request({
      url: app.publicFuc.yizhegou_url + 'cart/addCart',
      method: 'GET',
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken()},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          app.showToast('success', '加入购物车成功');
        }else{
          app.showToast('none', res.data.msg);
        }
      }
    })
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    var activity_id = options.id;
    var code = options.code;
    if(code){
      wx.setStorageSync(activity_id, code);
    }
    this.setData({
      activity_id: activity_id
    });
    this.getData();
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/activityInfo', 
      method: 'GET',
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken()},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          WxParse.wxParse('activity_content', 'html', data.activity.activity_content, that, 5);
          WxParse.wxParse('activity_description', 'html', data.activity.description, that, 5);
          commentJs.countdowm(that, data.activity.end_time);
          that.setData({
            imgUrls: data.images,
            activity: data.activity,
            goods: data.goods,
            goods_attr: data.goods_attr,
            goods_store: data.goods_store,
            store: data.store,
            is_container: false
          })
          wx.hideLoading();
        }
      },
      fail(){
        wx.hideLoading();
      }
    })

    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/getComment',
      method: 'GET',
      data: { activity_id: this.data.activity_id, p: 1, commentType: 1 },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if (data.length) {
            that.setData({
              is_vavluate: true
            })
          }
        }
      }
    })
  },
  async bindCollection() {
    var that = this;
    var is_collection = this.data.is_collection;
    var activity_id = this.data.activity_id;
    var data = { activity_id: activity_id, type: is_collection, token: await app.get_usertoken()};
      wx.request({
        url: app.publicFuc.yizhegou_url + 'activity/collectActivity',
        method: 'GET',
        data: data,
        success(res) {
          if (res.data.status > 0) {
            if (!is_collection) {
              console.log(1)
              that.setData({
                is_collection: 1
              })
              app.showToast('success','收藏成功');
            } else {
              console.log(0)
              that.setData({
                is_collection: 0
              })
              app.showToast('success', '取消收藏成功');
            }
          }
        }
      })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})