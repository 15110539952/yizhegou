// pages/My_activity/my_activity/my_activity.js
const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    is_like: true,
    page: 1,
    screenHeight: '',
    active: 0,
    activityAll: [
      { page: 1, is_bottom: false, activity_list: [], activity_type: '' },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 1 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 2 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 3 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 4 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 6 },
    ],
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight - 45
        });
      }
    });
  },
  onShow: function () {
    this.setData({
      active: app.globalData.activity_tab
    })
    this.getData();
    this.timeChange();
  },
  onPullDownRefresh: function () {
    var activityAll = [
      { page: 1, is_bottom: false, activity_list: [], activity_type: '' },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 1 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 2 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 3 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 4 },
      { page: 1, is_bottom: false, activity_list: [], activity_type: 6 },
    ];
    this.setData({
      activityAll: activityAll
    })
    this.getData();
  },
  onChange(e) {
    var index = e.detail.index;
    this.setData({ active: index });
    app.globalData.activity_tab = index
    // var data = this.data.activityAll[index];
    // if (data.is_bottom) { return false }
    var activityAll = this.data.activityAll;
    activityAll[index].page = 1;
    activityAll[index].is_bottom = false;
    activityAll[index].activity_list = [];
    this.setData({
      activityAll: activityAll
    })
    // if (data.page == 1) {
      this.getData();
    // }
  },
  bindAllscroll: function () {
    var data = this.data.activityAll[this.data.active];
    if (data.is_bottom) { return false }
    this.getData();
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var active = this.data.active;
    if (active==6){
      active = 5;
    }
    var data = this.data.activityAll[active];
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getActivityList',
      method: 'GET',
      data: { token: await app.get_usertoken(), p: data.page, type: active==5?6:active},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var activityAll = that.data.activityAll;
          if (!data || !data.length) {
            activityAll[active].is_bottom = true;
            that.setData({
              activityAll: activityAll
            })
            return false;
          }
          activityAll[active].activity_list = activityAll[active].activity_list.concat(data);
          // activityAll[active].activity_list.push({ end_time: 1545667200000, activity_status: 9})
          // activityAll[active].activity_list.push({ end_time: 1545840008, activity_status: 9})
          activityAll[active].page = activityAll[active].page += 1;
          that.setData({
            activityAll: activityAll,
          })
        }
      },
      complete() {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  bindTaskbtn: function (e) {
    let index = e.target.dataset.index;
    let id = e.target.dataset.id;
    let activity_order_id = e.target.dataset.order_id;
    wx.navigateTo({
      url: '/pages/My_activity/activity_awards/activity_awards?type=' + index + '&id=' + id + '&activity_order_id=' + activity_order_id
    })
  },
  timeChange(){
    var that = this;
    var activityAll = this.data.activityAll;
    var active = this.data.active;
    setInterval(function () {
      activityAll[active].activity_list.forEach(function (item) {
        var time = item.end_time + '';
        if (time.split("").length < 13) { time = time * 1000 }
        time*=1;
        let nowTime = new Date();
        let endTime = new Date(time);
        let t = endTime.getTime() - nowTime.getTime();

        if (t > 0) {
          let day = Math.floor(t / 86400000);
          let hour = Math.floor((t / 3600000) % 24);
          let min = Math.floor((t / 60000) % 60);
          let sec = Math.floor((t / 1000) % 60);
          if (day < 0) {
            item.count_down = {
              myHour: hour < 10 ? "0" + hour : hour,
              myMinite: min < 10 ? "0" + min : min,
              mySecond: sec < 10 ? "0" + sec : sec
            }
          } else {
            item.count_down = {
              myHour: hour + (day * 24),
              myMinite: min < 10 ? "0" + min : min,
              mySecond: sec < 10 ? "0" + sec : sec
            }
          }
        } else {
          item.count_down = {
            myHour: 0,
            myMinite: 0,
            mySecond: 0
          }
        }
      })
      that.setData({
        activityAll: activityAll
      })
    },1000)
  }
})