// pages/web_view/web_view.js
Page({
  data: {
    url:'',
  },
  onLoad: function (options) {
    this.setData({
      url: options.url
    })
  }
})