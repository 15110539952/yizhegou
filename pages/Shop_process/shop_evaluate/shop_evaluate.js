// pages/Shop_process/shop_evaluate/shop_evaluate.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
const commentJs = require('../../../commentJs/comment.js');
Page({
  data: {
    tab_index: 1,
    is_bottom:true,
    page: 1,
    evaluate_list:[],
    evaluate_num:[],
    activity_id:''
  },
  onLoad: function (options) {
    this.setData({
      activity_id: options.id
    })
    this.getEvaluateNum();
    this.getData();
  },
  bindTabChange:function(e) {
    const index = e.currentTarget.dataset.index;
    if (index == this.data.tab_index){
      return false;
    }
    this.setData({
      is_bottom: true,
      page: 1,
      evaluate_list: [],
      tab_index:index
    });
    this.getData();
  },
  getData: function () {
    wx:wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    var page = this.data.page;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/getComment',
      method: 'GET',
      data: { activity_id: this.data.activity_id, p: page, commentType: this.data.tab_index},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(!data.length){
            that.setData({
              is_bottom:false
            })
            return false;
          }
          for (var i in data) {
            data[i].add_time = commentJs.formatDate(new Date(data[i].add_time * 1000), 'yyyy-dd-MM hh:mm');
          }
          var evaluate_list = that.data.evaluate_list.concat(data);
          that.setData({
            evaluate_list: evaluate_list,
            page: page += 1
          })
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getEvaluateNum(){
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/getCommentSum',
      method: 'GET',
      data: { activity_id: this.data.activity_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            evaluate_num: data
          })
        }
      },
      complete() {
      }
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      is_bottom: true,
      evaluate_list: [],
      page: 1
    })
    this.getData();
  },
  onReachBottom: function () {
    if (this.data.is_bottom){
      this.getData();
    }
  },
  // 点赞
  async bindZan(e) {
    var comment_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/commentZan',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { comment_id: comment_id, token: await app.get_usertoken()  },
      success(res) {
        if(res.data.status>0){
          var evaluate_list = that.data.evaluate_list;
          var zan_num = parseInt(evaluate_list[index].zan_num) + 1;
          evaluate_list[index].zan_num = zan_num;
          that.setData({
            evaluate_list: evaluate_list
          })
        }
      },
      complete(res) {
        app.showToast('none',res.data.msg);
      }
    })
  },
})