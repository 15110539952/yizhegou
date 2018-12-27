// template/menu_navigation/menu_navigation.js
Component({
  externalClasses: ['menu-class'],
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    menu_type:true,
    animationData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    Menu_btn() {
      var menu_type = this.data.menu_type;
      var animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease',
      })
      this.animation = animation;
      if (menu_type){
        animation.right('0').step();
      } else {
        animation.right('-280rpx').step();
      }
      this.setData({
        animationData: this.animation.export(),
        menu_type: !menu_type
      })
    }
  }
})
