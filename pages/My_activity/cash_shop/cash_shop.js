// pages/My_activity/cash_shop/cash_shop.js
const app = getApp();
var commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    fenlei_show: false,
    kuaidi_array:['圆通快递','中通快递','顺丰快递'],
    kuaidi_index:'',
    fapiao_array:['普通发票','电子发票'],
    fapiao_index: '',
    shopgoods: '',
    shopgoods_text:'',
    activity: {},
    goods:{},
    rank: {},
    reward: {},
    myHour: '',
    myMinite: '',
    mySecond: ''
  },
  onLoad: function (options) {
    var activity_id = options.id;
    this.setData({
      activity_id: activity_id
    });
    this.getData();
  },
  fenleiShow() {
    this.setData({ fenlei_show: true });
  },
  fenleiClose() {
    this.setData({ fenlei_show: false });
  },
  bindKuaidiChange:function(e){
    this.setData({
      kuaidi_index: e.detail.value
    })
  },
  bindFapiaoChange:function(e){
    this.setData({
      fapiao_index: e.detail.value
    })
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/reward',
      method: 'GET',
      data: { activity_id: this.data.activity_id, token: await app.get_usertoken() },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var goods = data.activity.goods;
          var goods_store = data.activity.goods_store;

          for (let i in goods) {
            if (goods[i].k) {
              for (let j = 0; j < goods[i].spec.length; j++) {
                //颜色 内存
                //判断库存
                for (let k = 0; k < goods[i].spec[j].item.length; k++) {
                  var spec_count = 0;
                  for (let gs = 0; gs < goods_store.length; gs++) {
                    if (goods_store[gs].goods_id == goods[i].goods_id) {
                      var now_spec_item_id = goods[i].spec[j].item[k].item_id;
                      if (goods_store[gs].key.indexOf(now_spec_item_id) > -1) {
                        spec_count = spec_count + parseInt(goods_store[gs].store_count);
                      }
                    }
                  }
                  goods[i].spec[j].item[k].selected = false;
                  goods[i].spec[j].item[k].stock = spec_count;
                }
              }
            }
          }
          commentJs.countdowm(that, '2018-10-20 23:58:06');
          that.setData({
            activity: data.activity,
            rank: data.rank,
            reward: data.reward,
            goods: goods
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  bindGoodsItem(e) {
    var goods = this.data.goods;
    var goods_store = this.data.activity.goods_store;
    var index = e.target.dataset.index;
    var index2 = e.target.dataset.index2;
    var index3 = e.target.dataset.index3;
    var stock = e.target.dataset.stock;
    if (stock==0){return false}
    for (let i = 0; i < goods[index].spec[index2].item.length; i++){
      goods[index].spec[index2].item[i].selected = false;
    }
    goods[index].spec[index2].item[index3].selected = true;
    this.setData({
      goods: goods
    })
  },
  bindSelectOk(){
    var shopgoods_text = '';
    var shopgoods = [];
    var goods = this.data.goods;
    for(let i in goods){
      var obj = {}
      var spec = ''
      for (let j = 0; j < goods[i].spec.length; j++) {
        let is_select = false;
        for (let k = 0; k < goods[i].spec[j].item.length; k++) {
          if (goods[i].spec[j].item[k].selected) {
            spec += goods[i].spec[j].item[k].item_id + '_';
            shopgoods_text += goods[i].spec[j].item[k].item + ' ';
            is_select = true;
          }
        }
        if(!is_select){
          app.showToast('none', '请选择' + goods[i].goods_name+'的' + goods[i].spec[j].spec_name+'参数');
          return false;
        }
      }
      spec = spec.substr(0, spec.length - 1);
      // console.log(spec)
      obj.goods_id = goods[i].goods_id
      obj.spec = spec;
      shopgoods.push(obj);
    }
    this.setData({
      shopgoods: shopgoods,
      shopgoods_text: shopgoods_text,
      fenlei_show: false
    })
  },
  async bindCashShop() {
    var shopgoods = this.data.shopgoods;
    if (shopgoods.length<1){
      app.showToast('none','请选择型号参数');
      return false;
    }
    var data = { activity_id: this.data.activity_id, token: await app.get_usertoken()};
    for (let i = 0; i < shopgoods.length; i++) {
      data['goods[' + i + '][goods_id]'] = shopgoods[i].goods_id;
      data['goods[' + i + '][spec]'] = shopgoods[i].spec;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/cashPrize',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          wx.redirectTo({
            url: '/pages/My_activity/cash_success/cash_success'
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
        wx.hideLoading();
      }
    })
  }
})