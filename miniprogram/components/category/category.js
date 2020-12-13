// components/category/category.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        catagoryList: {
            type: Array
        }
    },

    // 数据监听
    observers: {
        catagoryList(value) {
            console.log(value)
        }
    },

    created() {
        console.log(this.properties.catagoryList)
    },

    lifetimes: {
        ready() {
            this._getData()
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        _getData() {
            console.log(this.properties.catagoryList)
        }
    }
})
