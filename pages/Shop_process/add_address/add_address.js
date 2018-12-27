// pages/Shop_process/add_address/add_address.js
const app = getApp();
const commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    regionShow: false,
    region_list: commentJs.address_list,//地址数据
    address_list: {},//地址提交信息
    region_text:'',
    is_default:true,
    error_phone:"",
    consignee:'',
    mobile:'',
    address:'',
    mail:'',
    address_id:''
  },
  onLoad: function (options) {
    let address_id = options.id;
    if (address_id) {
      this.setData({
        address_id: address_id,
        regionShow: false
      })
      this.getAddressChange();
    }
  },
  onShow:function(){
  },
  inputChange:function(e){
    var name = e.target.dataset.name;
    var value = e.detail;
    var address_list = this.data.address_list;
    address_list[name] = value;
    this.setData({
        address_list: address_list
    })
    if (name == 'mobile'){
      var mobile = this.data.address_list.mobile;
      if (commentJs.is_phone(mobile)) {
        this.setData({
          error_phone: ""
        })
      } else {
        this.setData({
          error_phone: "手机号格式错误"
        })
      }
    }
  },
  bindRegionConfirm: function (e) {
    // console.log(e)
    var value = e.detail.values;
    var address_list = this.data.address_list;
    address_list.areaCode = value[2].code;
    address_list.province = value[0].name;
    address_list.city = value[1].name;
    address_list.district = value[2].name;
    this.setData({
      address_list: address_list,
      region_text: value[0].name + value[1].name + value[2].name,
      regionShow: false
    })
  },
  //获取编辑地址
  getAddressChange: async function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/getAddress',
      method: 'GET',
      data: { token: await app.get_usertoken(), address_id: this.data.address_id },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          if(!data){return false}
          that.setData({
            address_list:data,
            region_text: data.province + data.city + data.district,
            is_default: parseInt(data.is_default) ? true : false,
            consignee: data.consignee,
            mobile: data.mobile,
            address: data.address,
            zipcode: data.zipcode
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  // 提交地址
  bindAddress:async function () {
    var address_list = this.data.address_list;
    if (!commentJs.is_phone(address_list.mobile)) {
      app.showToast('none', "手机号格式错误");
      return false;
    }
    if (!address_list.consignee){
      app.showToast('none', "请输入姓名");
      return false;
    }
    if (!address_list.district) {
      app.showToast('none', "请选择省市区");
      return false;
    }
    if (!address_list.address) {
      app.showToast('none', "请输入详细地址");
      return false;
    }
    address_list.is_default = this.data.is_default ? 1 : 0;
    address_list.address_id = this.data.address_id;
    address_list.token = await app.get_usertoken();
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/addAddress',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: address_list,
      success(res) {
        if (res.data.status > 0) {
          app.showToast('success', "保存成功");
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      complete(res) {
        app.showToast('none',res.data.msg)
      }
    })
  },
  binDeleteAddress: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除当前地址？',
      showCancel: true,
      success:async function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.request({
            url: app.publicFuc.yizhegou_url + 'user/del_address',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { id: that.data.address_id, token: await app.get_usertoken() },
            success(res) {
              if (res.data.status > 0) {
                app.showToast('success', "删除成功");
                wx.navigateBack({
                  delta: 1,
                })
              }
            },
            complete() {
              wx.hideLoading();
            }
          })
        }
      },
    })
  },
  // 设置默认地址
  setDefaultAddress:function(){
    this.setData({
      is_default: !this.data.is_default
    })
  },
  bindRegionShow:function(){
    this.setData({
      regionShow: true
    })
  },
  bindRegionHide: function () {
    this.setData({
      regionShow: false
    })
  }
})