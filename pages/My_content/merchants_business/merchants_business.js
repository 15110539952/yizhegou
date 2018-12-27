// pages/My_content/merchants_business/merchants_business.js
const app = getApp();
const commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    changqi: false,
    company_xz_index: '',
    company_ns_index: '',
    actionsTaxpayer: ['一般纳税人','小规模纳税人','非增值税纳税人'],//纳税
    actionsType:[],//公司性质
    actionsScname:[],//店铺类别
    active: 0,
    steps: [
      {
        text: '联系人信息'
      },
      {
        text: '公司信息'
      },
      {
        text: '店铺信息'
      },
      {
        text: '资质上传'
      },
      {
        text: '等待审核'
      }
    ],
    region_list: commentJs.address_list,//地址数据
    regionShow: false,//公司地址是否弹出
    address_list: {},//地址提交信息
    apply_type: '',
    ruleForm:{
      contacts_name: '',
      contacts_mobile: '',
      contacts_email: '',
    },
    ruleFormOne: {
      company_type:[],
      business_date_start:'',
      business_date_end:'',
    },
    ruleFormTwo: {},
    uploadimg_list: ['','',''],
  },
  onLoad: function (options) {
    // this.setData({
    //   apply_type: options.type || 1
    // })
    this.getOneData();
  },
  async bindFour_btn() {
    var uploadimg_list = this.data.uploadimg_list;
    if (!uploadimg_list[0]){
      app.showToast('none', '请上传店铺营业执照图片');
      return false;
    }
    if (!uploadimg_list[1]) {
      app.showToast('none', '请上传法人身份证正反面复印件或护照');
      return false;
    }
    if (!uploadimg_list[2]) {
      app.showToast('none', '请上传负责人身份证正反面复印件');
      return false;
    }
    var that = this;
    var data = { token: await app.get_usertoken(), business_licence_cert: uploadimg_list[0], legal_identity_cert: uploadimg_list[1], store_person_cert: uploadimg_list[2]};
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/remark',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            active: 4
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  async bindThree_btn() {//第三步提交店铺信息
    var data = this.data.ruleFormTwo;
    if (!data.store_name) {
      app.showToast('none', '请输入店铺名称');
      return false;
    }
    if (!data.seller_name) {
      app.showToast('none', '请输入店铺登录账号');
      return false;
    }
    if (!data.store_person_name) {
      app.showToast('none', '请输入店铺负责人姓名');
      return false;
    }
    if (!commentJs.is_idcard(data.store_person_identity)) {
      app.showToast('none', '店铺负责人身份证好不正确');
      return false;
    }
    if (!commentJs.is_phone(data.store_person_mobile)) {
      app.showToast('none', '手机号格式不正确');
      return false;
    }
    if (!commentJs.is_email(data.store_person_email)) {
      app.showToast('none', '邮箱格式不正确');
      return false;
    }
    if (!data.store_address) {
      app.showToast('none', '请输入详细地址');
      return false;
    }
    if (!data.sc_name) {
      app.showToast('none', '请输入店铺类别');
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    data.apply_type = this.data.apply_type;
    data.token = await app.get_usertoken();
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/seller_info',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            active: 3
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  async getThreeData() {//店铺信息获取
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/seller_info',
      method: 'GET',
      data: { token: await app.get_usertoken(), apply_type: this.data.apply_type },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var apply = data.apply;
          var actionsScname = [];
          if (data.store_class) {
            for (var i in data.store_class) {
              actionsScname.push({ name: data.store_class[i], id: i })
            }
          }
          that.setData({
            actionsScname: actionsScname,
            ruleFormTwo: {
              store_name: apply.store_name ? apply.store_name : '',
              seller_name: apply.seller_name ? apply.seller_name : '',
              store_person_name: apply.store_person_name ? apply.store_person_name : '',
              store_person_identity: apply.store_person_identity ? apply.store_person_identity : '',
              store_person_mobile: apply.store_person_mobile ? apply.store_person_mobile : '',
              store_person_email: apply.store_person_email ? apply.store_person_email : '',
              store_address: apply.store_address ? apply.store_address : '',
              sc_name: apply.sc_name ? apply.sc_name : '',
              sc_id: apply.sc_id ? apply.sc_id : ''
            }
          })
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  async bindTwo_btn() {//第二步提交公司信息
    var data = this.data.ruleFormOne;
    if (!data.company_name){
      app.showToast('none', '请输入公司名称');
      return false;
    }
    if (!data.orginAddress) {
      app.showToast('none', '请选择公司所在地');
      return false;
    }
    if (!data.company_address) {
      app.showToast('none', '请输入公司详细地址');
      return false;
    }
    if (!data.company_telephone) {
      app.showToast('none', '请输入公司电话');
      return false;
    }
    if (!data.business_licence_number) {
      app.showToast('none', '请输入同意社会信用码');
      return false;
    }
    if (!data.legal_person) {
      app.showToast('none', '请输入法人姓名');
      return false;
    }
    if (!data.business_date_start || !data.business_date_end) {
      app.showToast('none', '请选择证件有效期');
      return false;
    }
    if (!data.taxpayer) {
      app.showToast('none', '请选择纳税人类型');
      return false;
    }
    if (!commentJs.is_email(data.company_email)) {
      app.showToast('none', '公司邮箱格式不正确');
      return false;
    }
    if (!commentJs.is_idcard(data.legal_identity)) {
      app.showToast('none', '身份证格式错误');
      return false;
    }
    if (!data.reg_capital) {
      app.showToast('none', '请输入注册资金');
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    data.apply_type = this.data.apply_type;
    data.token = await app.get_usertoken();
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/basic_info',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            active: 2
          })
          that.getThreeData();
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  async getTwoData() {//公司信息获取
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/basic_info',
      method: 'GET',
      data: { token: await app.get_usertoken(), apply_type: this.data.apply_type },
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          var actionsType = [];
          if (data.company_type) {
            for (var i = 0; i < data.company_type.length; i++) {
              actionsType.push(data.company_type[i])
            }
          }
          // if (data.store_class) {
          //   for (var i in res.store_class) {
          //     actionsStore_class.push( data.store_class[i])
          //   }
          // }
          var apply = data.apply;
          if (apply.business_date_end == '长期') {
            that.setData({
              changqi: true
            })
          }
          var orginAddress = apply.company_province + apply.company_city + apply.company_district;
          that.setData({
            actionsType: actionsType,
            ruleFormOne: {
              company_district_code: apply.company_district_code ? apply.company_district_code : '',
              orginAddress: orginAddress == 'null' || orginAddress == '00'? '' : orginAddress,
              company_name: apply.company_name ? apply.company_name : '',
              company_type: apply.company_type ? apply.company_type : '',
              company_province: apply.company_province, // 省
              company_city: apply.company_city,  // 市
              company_district: apply.company_district, // 县
              company_address: apply.company_address == 'null' ? '' : apply.company_address, // 详细地址
              company_telephone: apply.company_telephone ? apply.company_telephone : '',
              company_email: apply.company_email ? apply.company_email : '',
              reg_capital: apply.reg_capital ? apply.reg_capital : '',
              business_licence_number: apply.business_licence_number ? apply.business_licence_number : '',
              legal_person: apply.legal_person ? apply.legal_person : '',
              legal_identity: apply.legal_identity ? apply.legal_identity : '',
              business_date_start: apply.business_date_start ? apply.business_date_start : '',
              business_date_end: apply.business_date_end ? apply.business_date_end : '',
              taxpayer: apply.taxpayer ? apply.taxpayer : '',
            }
          })
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  async bindOne_btn() {//第一步提交联系人信息
    var data = this.data.ruleForm;
    if (!data.contacts_name) {
      app.showToast('none', '请输入联系人姓名');
      return false;
    }
    if (!commentJs.is_phone(data.contacts_mobile)) {
      app.showToast('none', '手机号格式不正确');
      return false;
    }
    if (!commentJs.is_email(data.contacts_email)) {
      app.showToast('none', '邮箱格式不正确');
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    data.apply_type = this.data.apply_type;
    data.token = await app.get_usertoken();
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/contact',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            active: 1
          })
          that.getTwoData();
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  async getOneData(){//联系人信息获取
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'Newjoin/contact',
      method: 'GET',
      data: { token: await app.get_usertoken(), apply_type: this.data.apply_type},
      success(res) {
        if (res.data.status > 0) {
          var data = res.data.result;
          that.setData({
            ruleForm:{
              contacts_email: data.contacts_email,
              contacts_mobile: data.contacts_mobile,
              contacts_name: data.contacts_name
            }
          })
        }
      },
      complete(res) {
        wx.hideLoading();
        // app.showToast('none', res.data.msg);
      }
    })
  },
  // 绑定数据
  bindInputchange(e) {
    var name = e.currentTarget.dataset.name;
    var value = e.detail;
    if (this.data.active == 2) {
      var ruleFormTwo = this.data.ruleFormTwo;
      if (name == 'store_name' || name == 'seller_name' || name == 'store_person_name' || name == 'store_person_identity' || name == 'store_person_email' || name == 'store_address' || name == 'sc_name' || name == 'store_person_mobile') {
        ruleFormTwo[name] = value;
        this.setData({
          ruleFormTwo: ruleFormTwo
        })
      }
      return false;
    }
    if (this.data.active == 0) {
      var ruleForm = this.data.ruleForm;
      if (name == 'contacts_name' || name == 'contacts_mobile' || name == 'contacts_email') {
        ruleForm[name] = value;
        this.setData({
          ruleForm: ruleForm
        })
      }
      return false;
    }
    if (this.data.active == 1) {
      var ruleFormOne = this.data.ruleFormOne;
      if (name == 'company_name' || name == 'company_address' || name == 'company_email' || name == 'company_telephone' || name == 'business_licence_number' || name == 'legal_person' || name == 'legal_identity' || name == 'taxpayer' || name == 'reg_capital') {
        ruleFormOne[name] = value;
        this.setData({
          ruleFormOne: ruleFormOne
        })
      }
      return false;
    }
  },
  bindDateChange: function (e) {//公司信息日期
    var date = e.currentTarget.dataset.date;
    var ruleFormOne = this.data.ruleFormOne;
    if(date == 'start'){
      ruleFormOne.business_date_start = e.detail.value;
    }
    if(date == 'end'){
      ruleFormOne.business_date_end = e.detail.value;
    }
    this.setData({
      ruleFormOne: ruleFormOne
    })
  },
  bindChangqi() {//长期
    this.setData({
      changqi: !this.data.changqi
    })
    if (this.data.changqi) {
      var ruleFormOne = this.data.ruleFormOne;
      ruleFormOne.business_date_end = '长期';
      this.setData({
        ruleFormOne: ruleFormOne
      })
    }else{
      var ruleFormOne = this.data.ruleFormOne;
      ruleFormOne.business_date_end = '';
      this.setData({
        ruleFormOne: ruleFormOne
      })
    }
  },
  bindRegionConfirm: function (e) {//公司地址选择
    var value = e.detail.values;
    var address_list = this.data.address_list;
    address_list.areaCode = value[2].code;
    address_list.province = value[0].name;
    address_list.city = value[1].name;
    address_list.district = value[2].name;

    var ruleFormOne = this.data.ruleFormOne;

    ruleFormOne.company_province = value[0].name; // 省
    ruleFormOne.company_city = value[1].name;  // 市
    ruleFormOne.company_district = value[2].name // 县
    ruleFormOne.company_district_code = value[2].code // 县
    ruleFormOne.orginAddress = value[0].name + value[1].name + value[2].name; 

    this.setData({
      address_list: address_list,
      regionShow: false,
      ruleFormOne: ruleFormOne
    })
  },
  bindRegionShow: function () {//选择公司地址
    this.setData({
      regionShow: true
    })
  },
  bindRegionHide: function () {//选择公司地址
    this.setData({
      regionShow: false
    })
  },
  bindCompany_xz: function (e) {//选择纳税 性质
    var index = e.detail.value;
    var ruleFormOne = this.data.ruleFormOne;
    var nashui_xingzhi = e.currentTarget.dataset.name;
    if (nashui_xingzhi == 'nashui') {
      ruleFormOne.taxpayer = this.data.actionsTaxpayer[index];
      this.setData({
        ruleFormOne: ruleFormOne,
        company_ns_index: index
      })
    }
    if (nashui_xingzhi == 'xingzhi') {
      ruleFormOne.company_type = this.data.actionsType[index];
      this.setData({
        ruleFormOne: ruleFormOne,
        company_xz_index: index
      })
    }
  },
  bindSc_type(e) {//选择店铺类别
    var index = e.detail.value;
    var ruleFormTwo = this.data.ruleFormTwo;
    var actionsScname = this.data.actionsScname;
    ruleFormTwo.sc_name = actionsScname[index].name;
    ruleFormTwo.sc_id = actionsScname[index].id;
    this.setData({
      ruleFormTwo: ruleFormTwo,
    })
  },
  //照片上传
  bindClose(e) {//取消照片选择
    var uploadimg_list = this.data.uploadimg_list;
    var index = e.currentTarget.dataset.index;
    if (index == 0) {
      uploadimg_list[0] = '';
    }
    if (index == 1) {
      uploadimg_list[1] = '';
    }
    if (index == 2) {
      uploadimg_list[2] = '';
    }
    this.setData({
      uploadimg_list: uploadimg_list
    })
  },
  bindChoose(e) {//点击选择照片
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: 'compressed',
      success: async function (res) {
        let tempFilePath = res.tempFilePaths;//这里是选好的图片的地址，是一个数组
        var token = await app.get_usertoken();
        for (let i in tempFilePath) {
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.uploadFile({
            url: app.publicFuc.yizhegou_url + 'user/uploadimg',
            filePath: tempFilePath[i],
            name: 'img_file[]',
            formData: { token: token },
            success(res) {
              var jsonStr = res.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                res.data = jj;
              }
              var data = res.data;
              // console.log(data);
              if (data.status > 0) {
                let uploadimg_list = that.data.uploadimg_list;
                if(index == 0){
                  uploadimg_list[index] = data.result[0];
                }
                if (index == 1) {
                  uploadimg_list[index] = data.result[0];
                }
                if (index == 2) {
                  uploadimg_list[index] = data.result[0];
                }
                that.setData({
                  uploadimg_list: uploadimg_list
                })
              }
            },
            complete(res) {
              app.showToast('none', res.data.msg);
            }
          })
        }
      }
    })
  }
})