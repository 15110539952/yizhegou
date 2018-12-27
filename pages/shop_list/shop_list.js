// pages/shop_list/shop_list.js
const app = getApp();
Page({
  data: {
    is_container: true,
    is_like: true,
    page:1,
    shop_list:[],
    current_scroll: 'all',
    class_id:'',
    search_show:true,
    search_value:'',
    hot_search:[],
    near_search:[],
    store_id: '',
    cat_id:'',
    store_class:[],
    shop_list_type:'',
    hot:''
  },
  onLoad: function (options) {
    if (options.type =='store_search'){
      this.setData({
        shop_list_type: 'store',
        store_id: options.store_id,
        cat_id: options.cat_id
      })
      this.searchShow();
      this.getStoreClassData();
    }
    // 店铺商品分类列表
    if (options.type == 'store'){
      this.setData({
        shop_list_type: 'store',
        store_id: options.store_id,
        cat_id: options.cat_id,
        current_scroll: options.cat_id||'all',
        hot:options.hot||''
      })
      this.getDatatype();
      this.getStoreClassData();
    }
    // 商品分类列表
    if (options.type == 'class') {
      app.changeTitle('商品列表');
      this.getClassData(options.id);
      this.setData({
        shop_list_type: 'class',
        class_id: options.id
      })
    }
    //搜索列表
    if (options.type == 'search') {
      app.changeTitle('商品列表');
      this.setData({
        shop_list_type: 'search'
      })
      this.searchShow();
    }
  },
  handleChangeScroll({ detail }) {
    this.setData({
      is_like: true,
      page: 1,
      shop_list: [],
      current_scroll: detail.key,
      cat_id: detail.key
    });
    //开始请求 搜索关键字 函数
    if (this.data.shop_list_type == "store") {
      this.getStoreClasslistData();
    } else {
      this.getClassData('');
    }
  },
  valueChange:function(e){
    this.setData({
      search_value:e.detail.value
    })
  },
  //热门搜索关键词
  searchShow:function(){
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/get_hot_keywords',
      method: 'GET',
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            hot_search: res.data.result
          })
        }
      }
    })
    this.setData({
      near_search: wx.getStorageSync('near_search') || [],
      search_show: false
    })
  },
  btnSearch: function (e) {
    var search_value = this.data.search_value;
    var near_search = wx.getStorageSync('near_search') || [];
    if (near_search.indexOf(search_value) == -1){
      near_search.push(search_value);
      wx.setStorageSync('near_search', near_search);
    }
    this.setData({
      is_like: true,
      page: 1,
      shop_list: [],
      near_search: near_search
    })
    this.getDatatype();
  },
  //分类进入请求的接口
  getClassData:function(id) {
    var that = this;
    var page = this.data.page, 
    data = { p: page };
    if(id !== ''){
      data.cat_id = id;
    }
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Activity/activity_list', 
      method: 'GET',
      data: data,
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if (!data.activity_list.length > 0) {
            that.setData({
              is_like: false,
              is_container: false
            })
          }
          var shop_list = that.data.shop_list.concat(data.activity_list);
          that.setData({
            shop_list: shop_list,
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
  //点击搜索进入请求的接口
  getSearchData: function () {
    var that = this;
    var page = this.data.page;
    var search_value = this.data.search_value;
    var data = {p: page, q: search_value};
    if (this.data.class_id){
      data.cat_id = this.data.class_id;
    }
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Activity/search',
      method: 'GET',
      data: data,
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if (!data.goods_list.length > 0) {
            that.setData({
              is_like: false,
              is_container: false
            })
          }
          var shop_list = that.data.shop_list.concat(data.goods_list);
          that.setData({
            shop_list: shop_list,
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

  //请求店铺分类列表
  getStoreClasslistData: function () {
    var that = this;
    var page = this.data.page;
    var cat_id = this.data.cat_id == 'all'? "": this.data.cat_id;
    var data = { p: page, q: this.data.search_value, store_id: this.data.store_id, cat_id: cat_id };
    var url_type = this.data.hot ? 'store/storeHot' : 'store/storeGoods';
    wx.request({
      url: app.publicFuc.yizhegou_url + url_type,
      method: 'GET',
      data: data,
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if (!data.length > 0) {
            that.setData({
              is_like: false,
              is_container: false
            })
          }
          var shop_list = that.data.shop_list.concat(data);
          that.setData({
            shop_list: data,
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
  
  //请求店铺分类
  getStoreClassData:function(){
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'store/storeGoodsClass',
      method: 'GET',
      data: { store_id: this.data.store_id},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            store_class: data,
          })
        }
      }
    })
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Store/about',
      method: 'GET',
      data: { store_id: this.data.store_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          app.changeTitle(data.store_name);
        }
      }
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      is_like: true,
      page: 1,
      shop_list: []
    })
    this.getDatatype();
  },
  onReachBottom: function () {
    if (!this.data.is_like) { return false }
    this.getDatatype();
  },
  getDatatype:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    if (this.data.shop_list_type == "store") {
      this.getStoreClasslistData();
    }
    if (this.data.class_id) {
      this.getClassData(this.data.class_id);
    }
    if (this.data.shop_list_type == 'search') {
      this.getSearchData();
    }
  }
})