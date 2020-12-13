const app = getApp()

Page({
    data: {
      swiperList: [],
      categoryList: [],
    },

    onLoad: function(options) {
      this.getSwiper()
      this.getPigCategory()
    },

    // 获取轮播图
    getSwiper() {
      wx.cloud.callFunction({
        name: "getSwiper"
      }).then((res) => {
        console.log('[轮播图][查找记录] 成功：', res)
        this.setData({
          swiperList: res.result.data
        })
      }).catch((err) => {
        console.log('[轮播图][查找记录] 失败：', res)
      })
    },

    // 获取猪的分类
    getPigCategory() {
      wx.cloud.callFunction({
        name: 'getCategory'
      }).then((res) => {
        console.log('[猪分类][查找记录] 成功：', res)
        this.setData({
          categoryList: res.result.data
        })
      }).catch((err) => {
        console.log('[猪分类][查找记录] 失败：', res)
      })
    },

    // 轮播图详情
    _onGetIntro(event) {
      // console.log('event: ', event)
      let swiperId = event.target.dataset.id
      wx.navigateTo({
        url: `../../pages/swiperIntro/swiperIntro?swiperid=${swiperId}`,
      })
    },

    // 获取分类详情
    _onGetCateList(event) {
      // console.log('event: ', event)
      let categoryName = event.currentTarget.dataset.name
      wx.navigateTo({
        url: `../../pages/cateInfo/cateInfo?categoryname=${categoryName}`,
      })
    }
})
