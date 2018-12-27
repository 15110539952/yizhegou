// pages/Shop_process/recruit_activity_detail/recruit_activity_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guize_show: false,
    imgUrls: [
      {
        "image": "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175111_9509.jpg",
        "goodsId": "da34d6f381464a219b37a9ac0ad579e8"
      },
      {
        "image": "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175040_1780.jpg",
        "goodsId": "b1195296679f482aa7d54d95ac2b4a94"
      },
      {
        "image": "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175142_6947.jpg",
        "goodsId": "ad176e397858448a854dc50371334faf"
      }
    ]
  },
  onLoad: function (options) {

  },
  guizeShow() {
    this.setData({ guize_show: true });
  },
  guizeClose() {
    this.setData({ guize_show: false });
  },
  onShow: function () {

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