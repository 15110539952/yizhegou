//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page:1,
    gonggao:[],
    hot_activity:[],
    like_activity:[],
    is_like:true,
    gonggao_detail:{},
    banner:[],
    recommend:[],
    seller:[],
    imgUrls: [
      {
        "image": "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175040_1780.jpg",
        "goodsId": "b1195296679f482aa7d54d95ac2b4a94"
      },
      {
        "image": "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175111_9509.jpg",
        "goodsId": "da34d6f381464a219b37a9ac0ad579e8"
      },
      {
        "image": "http://images.baixingliangfan.cn/advertesPicture/20180407/20180407175142_6947.jpg",
        "goodsId": "ad176e397858448a854dc50371334faf"
      }
    ]
  },
  onLoad: function () {
    this.getData();
  },
  bindBannerUrl(e){
    var media_type = e.currentTarget.dataset.index;
    var url = e.currentTarget.dataset.url;
    if (media_type==0){
      wx.navigateTo({
        url: '/pages/Shop_process/store_detail/store_detail?id=' + url,
      })
    }
    if (media_type == 1) {
      wx.navigateTo({
        url: '/pages/Shop_process/shop_detail/shop_detail?id=' + url,
      })
    }
    if (media_type == 2) {
      wx.navigateTo({
        url: '/pages/web_view/web_view?url=' + url,
      })
    }
  },
  // bindGonggao(e) {
  //   var media_type = gonggao_detail.media_type;
  //   var url = gonggao_detail.ad_link;
  //   if (media_type == 0) {
  //     wx.navigateTo({
  //       url: '/pages/Shop_process/store_detail/store_detail?id=' + url,
  //     })
  //   }
  //   if (media_type == 1) {
  //     wx.navigateTo({
  //       url: '/pages/Shop_process/shop_detail/shop_detail?id=' + url,
  //     })
  //   }
  //   if (media_type == 2) {
  //     wx.navigateTo({
  //       url: '/pages/web_view/web_view?url=' + url,
  //     })
  //   }
  // },
  getData(){
    var that = this;
    // 获取首页接口：轮播图、热门商家推荐、最新推荐
    wx.request({
      url: app.publicFuc.yizhegou_url+'index/home', 
      method:'GET',
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            hot_activity: data.activity.hot_activity,
            banner: data.ad.banner,
            recommend: data.ad.recommend,
            seller: data.ad.seller,
            gonggao: data.ad.gonggao||[],
            gonggao_detail: data.ad.gonggao[0]||''
          })
          var index = data.ad.gonggao.length;
          var i = 1;
          setInterval(function(){
            if(i >= index){
              i = 0
            }
            that.setData({
              gonggao_detail: data.ad.gonggao[i]
            })
          },5000)
        }
      }
    })
    this.getlikeActivity();
  },
  getlikeActivity: function () {
    if (!this.data.is_like){return false;}
    var that = this;
    var page = this.data.page;
    // 获取首页接口：猜你喜欢
    wx.request({
      url: app.publicFuc.yizhegou_url + 'index/likeActivity', 
      method: 'GET',
      data:{p:page},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(!data.length>0){
            that.setData({
              is_like:false
            })
          }
          var like_activity = that.data.like_activity.concat(data);
          that.setData({
            like_activity: like_activity,
            page: page+=1
          })
        }
      }
    })
  },
  onReachBottom: function () {
    this.getlikeActivity();
  },
})
