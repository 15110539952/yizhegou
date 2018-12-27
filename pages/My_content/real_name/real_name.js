// pages/My_content/real_name/real_name.js
const app = getApp();
const commentJs = require('../../../commentJs/comment.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({
  data: {
    yizhegou_img: app.publicFuc.yizhegou_img,
    id_card_show:false,
    xieyi: true,
    active: 0,
    steps: [
      {
        text: '信息填写'
      },
      {
        text: '银行卡信息'
      },
      {
        text: '认证成功'
      }
    ],
    region: [],
    date:'',
    address:'',
    realname: '',
    nickname: '',
    gender: '', // 性别 0：未知、1：男、2：女
    province: '', // 省
    city: '', // 城市
    country: '', // 国家
    id_card_code:'',
    card_num: '',
    open_bank: '',
    uploadimg_list:[],
    // tempFilePaths: []//临时图片数组
    mobile: '',
    code: '',
    is_verif: false,
    verif_text: '发送验证码',
    is_change: 0
  },
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        that.setData({
          nickname: userInfo.nickName,
          gender: userInfo.gender,
          province: userInfo.province,
          city: userInfo.city,
          country: userInfo.country
        })
      }
    })
    this.setData({
      is_change: options.change || 0
    })
  },
  getPhoneNumber(e){
    console.log(e)
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
  },
  bindImgtest(){
    this.setData({
      id_card_show:true
    })
  },
  onClose() {
    this.setData({ id_card_show: false });
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  async bindOne_btn() {
    if (!this.data.xieyi) {
      app.showToast('none', '请输入同意用户协议')
      return false
    }
    if (!this.data.nickname) {
      app.showToast('none', '请输入用户名')
      return false
    }
    // if (!this.data.realname) {
    //   app.showToast('none', '请输入姓名')
    //   return false
    // }
    // if (!this.data.region.length) {
    //   app.showToast('none', '请选择省市区');
    //   return false
    // }
    // if (!this.data.address) {
    //   app.showToast('none', '请输入地址');
    //   return false
    // }
    if (!commentJs.is_phone(this.data.mobile)) {
      app.showToast('none', '手机号不正确')
      return false
    }
    if (!this.data.code) {
      app.showToast('none', '请输入验证码');
      return false
    }
    // if (!this.data.date) {
    //   app.showToast('none', '请输入身份证有效期');
    //   return false
    // }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/updateUserInfo1',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { token: await app.get_usertoken(), mobile: this.data.mobile, nickname: this.data.nickname,mobile: this.data.mobile, code: this.data.code, unique_id: wx.getStorageSync('unique_id'), },
      // data: { token: await app.get_usertoken(), mobile: this.data.mobile, nickname: this.data.nickname, realname: this.data.realname, mobile: this.data.mobile, code: this.data.code, unique_id: wx.getStorageSync('unique_id'), province: this.data.region[0] || '', city: this.data.region[1] || '', district: this.data.region[2] || '' },
      success(res) {
        if (res.data.status > 0) {
          if (that.data.is_change){
            wx.navigateBack({
              delta: 1,
            })
          } else {
            that.setData({
              active: 1
            })
          }
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  bindTwo_btn: function () {//上一步
    this.setData({
      active: 0
    })
  },
  async bindReal() {
    if (!this.data.realname) {
      app.showToast('none', '请输入姓名')
      return false
    }
    if (!commentJs.is_idcard(this.data.id_card_code)) {
      app.showToast('none', '身份证不正确');
      return false;
    }
    if (!this.data.card_num) {
      app.showToast('none', '请输入银行卡号')
      return false
    }
    if (!this.data.open_bank) {
      app.showToast('none', '请输入开户行信息')
      return false
    }
    if (!commentJs.is_phone(this.data.mobile)) {
      app.showToast('none', '手机号不正确')
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/verification',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { token: await app.get_usertoken(), name: this.data.realname, idno: this.data.id_card_code, cardno: this.data.card_num, open_bank:this.data.open_bank, phoneno:this.data.mobile},
      success(res) {
        if (res.data.status > 0) {
          that.setData({
            active: 2
          })
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
  //身份证有效期长期
  bindChangqi(e){
    this.setData({
      date:'长期'
    })
  },
  // 绑定数据
  bindInputchange(e) {
    var name = e.currentTarget.dataset.name;
    var value = e.detail;
    if (name == 'nickname') {
      this.setData({
        nickname: value
      })
    }
    if (name == 'realname') {
      this.setData({
        realname: value
      })
    }
    if (name == 'id_card_code') {
      this.setData({
        id_card_code: value
      })
    }
    if (name == 'address') {
      this.setData({
        address: value
      })
    }
    if (name == 'mobile') {
      this.setData({
        mobile: value
      })
    }
    if (name == 'card_num') {
      this.setData({
        card_num: value
      })
    }
    if (name == 'open_bank') {
      this.setData({
        open_bank: value
      })
    }
    if (name == 'code') {
      this.setData({
        code: value
      })
    }
  },
  // 同意协议
  bindXieyi: function () {
    this.setData({
      xieyi: !this.data.xieyi
    })
  },
  //选择删除图片
  bindClose(e) {
    let uploadimg_list = this.data.uploadimg_list;
    uploadimg_list.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      uploadimg_list: uploadimg_list
    })
  },
  bindChoose() {
    var that = this;
    var tempFilePaths = this.data.tempFilePaths;
    wx.chooseImage({
      sizeType: 'compressed',
      success: async function (res) {
        let tempFilePath = res.tempFilePaths;//这里是选好的图片的地址，是一个数组
        var token = await app.get_usertoken();
        for (let i in tempFilePath){
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.uploadFile({
            url: app.publicFuc.yizhegou_url + 'user/uploadimg',
            filePath: tempFilePath[i],
            name: 'img_file[]',
            formData: {token: token},
            success(res) {
              var jsonStr = res.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                res.data = jj;
              }
              var data =res.data;
              // console.log(data);
              if (data.status > 0) {
                let uploadimg_list = that.data.uploadimg_list;
                uploadimg_list = uploadimg_list.concat(data.result);
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
  },
  //跳过
  bindTiaoguo(){
    wx.switchTab({
      url: '/pages/me/me',
    })
  },
  bindCode() {
    var mobile = this.data.mobile;
    if (!commentJs.is_phone(mobile)) {
      app.showToast('none', '手机号不正确')
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: app.publicFuc.yizhegou_url + 'user/send_sms_code',
      method: 'GET',
      data: { mobile: mobile, unique_id: wx.getStorageSync('unique_id') },
      success(res) {
        if (res.data.status > 0) {
          // that.setData({
          //   code: res.data.code
          // })
          that.setData({
            disabled_verif: true,
            verif_text: '60后获取'
          });
          that.setData({
            is_verif: true
          });
          var s = 60;
          var time = setInterval(function () {
            that.setData({
              disabled_verif: true,
              verif_text: s + 's后获取'
            });
            if (s == 1) {
              clearInterval(time);
              that.setData({
                disabled_verif: false,
                verif_text: '重新获取'
              });
              return false;
            }
            s--;
          }, 1000);
        } else {
          that.setData({
            disabled_verif: false,
            verif_text: '重新获取'
          });
        }
      },
      complete(res) {
        app.showToast('none', res.data.msg);
      }
    })
  },
})