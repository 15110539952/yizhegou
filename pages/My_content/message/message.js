// pages/My_content/message/message.js
Page({
  data: {
    message:[
      {
        content_show:true
      }
    ]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  bindMess_shouqi:function(e){
    this.setData({
      message: [{ content_show: true}]
    })
  },
  bindMess_zhangkai:function(e){
    this.setData({
      message: [{ content_show: false}]
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})