// pages/Shop_process/shop_cart/shop_cart.js
var app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    is_container: true,
    address: { consignee:'请点击设置默认收货地址'},
    cart_list:[],
    price_list: { 
      commission_price:'0.00',
      service_price: '0.00',
      ticket_price: '0.00',
      total_fee: '0.00',
      shipping_price: '0.00'
    },
    total_price: 0,
    selectAll: false,
    address_id: '',
    activity_id: '',
    activity: ''
  },
  onLoad: function (options) {
    if (options.id){
      this.setData({
        activity_id: options.id
      })
      this.getOneData();
    }else{
      this.getData();
    }
    this.setData({
      address_id: app.globalData.address_id
    })
    this.getAddress();
  },
  onShow:function(){
    var address_id = this.data.address_id;
    if (address_id != app.globalData.address_id){
      console.log(address_id);
      this.setData({
        address_id: app.globalData.address_id
      })
      this.getAddress();
    }
  },
  onSubmit: async function () {
    var address_id = this.data.address_id;
    if (!address_id){
      app.showToast('none','请先选择地址');
      return false
    }
    var activity_id = this.data.activity_id;
    if (activity_id){
      var data = { address_id: address_id, token: await app.get_usertoken(), act: 'submit_order' };
      data['cart[0][a]'] = activity_id;
      data['cart[0][c]'] = wx.getStorageSync(activity_id) || '';
    }else{
      var cart = [];
      var cart_list = this.data.cart_list;
      for (var i = 0; i < cart_list.length; i++) {
        for (var j = 0; j < cart_list[i].cartList.length; j++) {
          let data = cart_list[i].cartList[j];
          data.is_select = data.is_select;
          if (data.is_select) {
            cart.push({ a: data.activity_id, c: wx.getStorageSync(data.activity_id) || '' });
            // cart.push({ a: data.activity_id, i: data.inviter, t: data.inviter_task});
          }
        }
      }
      if (!cart.length) {
        app.showToast('none', '请先选择商品');
        return false
      }
      var data = { address_id: address_id, token: await app.get_usertoken(), act: 'submit_order' };
      for (let i = 0; i < cart.length; i++) {
        data['cart[' + i + '][a]'] = cart[i].a;
        data['cart[' + i + '][c]'] = cart[i].c;
      }
    // for (let i = 0; i < cart.length; i++) {
    //   data['cart[' + i + '][a]'] = cart[i].a;
    //   data['cart[' + i + '][i]'] = cart[i].i;
    //   data['cart[' + i + '][t]'] = cart[i].t;
    // }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'cart/cart3',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          app.showToast('none', '正在跳转到支付...');
          var order_sn = res.data.result;
          // 微信支付
          wx.request({
            url: app.publicFuc.yizhegou_img + 'WXAPI/Cart/getWXPayInfo?order_id=' + order_sn,
            method: 'GET',
            success: function (res) {
              var data = res.data.wdata;
              data.timeStamp = String(data.timeStamp);
              wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': 'MD5',
                'paySign': data.sign,
                'success': function (res) {
                  wx.showToast({
                    title: '付款成功',
                    success: function () {
                      wx.redirectTo({
                        url: '/pages/Shop_process/pay_success/pay_success?id=' + order_sn,
                      })
                    }
                  })
                },
                'fail': function (res) {
                  app.showToast('none', '付款失败,请重试');
                }
              })
            }
          });
          
          // wx.request({
          //   url: app.publicFuc.yizhegou_url + 'cart/test_pay',
          //   method: 'GET',
          //   data: { order_sn: order_sn},
          //   success(res) {
          //     // if (res.data.status > 0) {
          //     //   app.showToast('success', '订单提交成功');
          //     // }
          //     wx.redirectTo({
          //       url: '/pages/Shop_process/pay_success/pay_success?id=' + order_sn,
          //       success: function (res) { },
          //       complete: function (res) { },
          //     })
          //   },
          //   complete() {
          //     wx.hideLoading();
          //   }
          // })
          // wx.redirectTo({
          //   url: '/pages/Shop_process/pay_success/pay_success?id=' + res.data.result,
          //   success: function(res) {},
          //   complete: function(res) {},
          // });
        }
      },
      fail(res){
        app.showToast('none', res.data.msg);
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  bindDeleteCart: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除当前商品',
      showCancel: true,
      success:async function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
            mask: true
          });
          wx.request({
            url: app.publicFuc.yizhegou_url + 'cart/delCart',
            method: 'GET',
            data: { token: await app.get_usertoken(), ids: id },
            success(res) {
              if (res.data.status > 0) {
                that.getData();
              }
            },
            complete(){
              wx.hideLoading();
            }
          })
        }
      }
    })
  },
  bindSelect: function(e){
    var list_index = e.currentTarget.dataset.listindex;
    var index = e.currentTarget.dataset.index;
    var cart_list = this.data.cart_list;
    cart_list[list_index].cartList[index].is_select = !cart_list[list_index].cartList[index].is_select;

    var selectAll = true;
    var price_list = { commission_price: 0, service_price: 0, total_fee: 0, ticket_price: 0, shipping_price:0};
    for (var i = 0; i < cart_list.length; i++) {
      for (var j = 0; j < cart_list[i].cartList.length; j++) {
        let data = cart_list[i].cartList[j];
        data.is_select = data.is_select;
        if(data.is_select){
          price_list.commission_price += parseFloat(data.commission_price);
          price_list.service_price += parseFloat(data.service_price);
          price_list.total_fee += parseFloat(data.price);
          price_list.ticket_price += parseFloat(data.ticket_price);
          price_list.shipping_price += parseFloat(data.shipping_price);
        }else{
          selectAll = false
        }
      }
    }
    this.computedPrice(price_list);
    this.setData({
      cart_list: cart_list,
      selectAll: selectAll
    })
  },
  bindSelectAll: function () {
    var cart_list = this.data.cart_list;
    var selectAll = this.data.selectAll;
    var price_list = { commission_price: 0, service_price: 0, total_fee: 0, ticket_price: 0, shipping_price: 0};

    for (var i = 0; i < cart_list.length;i++){
      for (var j = 0; j < cart_list[i].cartList.length; j++) {
        let data = cart_list[i].cartList[j];
        data.is_select = !selectAll;
        if (!selectAll){
          price_list.commission_price += parseFloat(data.commission_price);
          price_list.service_price += parseFloat(data.service_price);
          price_list.total_fee += parseFloat(data.price);
          price_list.ticket_price += parseFloat(data.ticket_price);
          price_list.shipping_price += parseFloat(data.shipping_price);
        }
      }
    }
    this.computedPrice(price_list);

    this.setData({
      selectAll: !selectAll,
      cart_list: cart_list,
    })
  },
  getData: async function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'cart/cartList', 
      method: 'GET',
      data: { token: await app.get_usertoken(), unique_id:''},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var cart_list = data.storeList;
          if (!cart_list){return false};
          for (var i = 0; i < cart_list.length; i++) {
            for (var j = 0; j < cart_list[i].cartList.length; j++) {
              cart_list[i].cartList[j].is_select = false;
            }
          }
          that.setData({
            cart_list: data.storeList || [],
          })
        }
      },
      complete(){
        that.setData({
          is_container: false
        })
        wx.hideLoading();
      }
    })
  },
  getOneData: async function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'activity/activityInfo', 
      method: 'GET',
      data: { activity_id: this.data.activity_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var price_list = {
              commission_price: parseFloat(data.activity.commission_price),
              service_price: parseFloat(data.activity.service_price),
              ticket_price: parseFloat(data.activity.ticket_price),
              total_fee: parseFloat(data.activity.price),
            shipping_price: parseFloat(data.activity.shipping_price)
            };
          that.computedPrice(price_list);
          that.setData({
            activity: data
          })
        }
      },
      complete() {
        that.setData({
          is_container: false
        })
        wx.hideLoading();
      }
    })
  },
  getAddress:async function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var address_id = this.data.address_id;
    var addressUrl = address_id ?'user/getAddress':'user/getDefaultAddress';
    wx.request({
      url: app.publicFuc.yizhegou_url + addressUrl,
      method: 'GET',
      data: { token:await app.get_usertoken(), address_id: address_id},
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            address: res.data.result,
            address_id: res.data.result.address_id
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  computedPrice: function (price_list){
    var commission_price = price_list.commission_price;
    var service_price = price_list.service_price;
    var ticket_price = price_list.ticket_price;
    var shipping_price = price_list.shipping_price;
    var total_fee = price_list.total_fee;
    // console.log(price_list)
    commission_price = commission_price.toFixed(2);
    service_price = service_price.toFixed(2);
    ticket_price = ticket_price.toFixed(2);
    shipping_price = shipping_price.toFixed(2);
    total_fee = total_fee.toFixed(2);
    

    var total_price = parseFloat(commission_price) +
      parseFloat(service_price) +
      parseFloat(ticket_price) +
      parseFloat(shipping_price) +
      parseFloat(total_fee);

    total_price = total_price.toFixed(2) * 100;
    this.setData({
      price_list: {
        commission_price: commission_price,
        service_price: service_price,
        ticket_price: ticket_price,
        shipping_price: shipping_price,
        total_fee: total_fee,
      },
      total_price: total_price
    })
  }
})