// pages/class/class.js
const app = getApp();
Page({

  data: {
    class_list:[],
    class_content:[],
    curNav: 1,
  },
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id;
    this.setData({
      curNav: id,
    })
    this.getClass_content(id);
  },
  onLoad: function (options) {
    this.getData();
  },
  getData() {
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'goods/goodsCategoryList', 
      method: 'GET',
      data: { parent_id:0},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.getClass_content(data[0].id);
          that.setData({
            class_list:data
          })
        }
      }
    })
  },
  getClass_content(id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'goods/goodsCategoryList', 
      method: 'GET',
      data: { parent_id: id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            class_content: data
          })
        }
      },
      complete(){
        wx.hideLoading();
      }
    })
  }
})
