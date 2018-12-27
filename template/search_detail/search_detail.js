// template/search_detail/search_detail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:Boolean,
    nearSearch:{
      type:Array,
      value:[]
    },
    hotSearch:{
      type: Array,
      value: []
    },
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    search_value:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    valueChange(e) {
      this.triggerEvent('valueChange', { value: e.detail.value }, { bubbles: true });
    },
    labelChange(e){
      const value = e.target.dataset.content;
      this.setData({
        search_value: value
      });
      this.triggerEvent('valueChange', { value:value }, { bubbles: true });
    },
    btnSearch(e) {
      this.triggerEvent('btnSearch', {}, { bubbles: true });
      this.setData({
        show: !this.data.show
      })
    }
  }
})
