Component({
    externalClasses: ['i-class'],

    relations: {
        '../collapse-item/index': {
            type: 'child'
        }
    },
    properties: {
        name: String,
        accordion: Boolean
    },
    methods: {
      clickfn(e) {
            const params = e.detail;
            const allList = this.getRelationNodes('../collapse-item/index');
            allList.forEach((item) => {
                if (params.name === item.data.name) {
                    item.setData({
                        showContent: 'i-collapse-item-show-content'
                  });
                  this.triggerEvent('ComponentIcon', { name: item.data.name }, { bubbles: true });
                } else {
                    item.setData({
                        showContent: ''
                  });
                }
            });
      }
    }
});

