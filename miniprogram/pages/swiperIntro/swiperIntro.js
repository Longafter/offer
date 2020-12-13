// pages/swiperIntro/swiperIntro.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperIntro: {},
        introduce: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options)
        let swiperId = options.swiperid
        this.getSwiperIntro(swiperId)
    },

    // 获取swiper详情
    getSwiperIntro(swiperId) {
        wx.cloud.callFunction({
            name: 'getSwiperIntro',
            data: {
                swiperId,
            }
        }).then((res) => {
            console.log('[轮播图详情][查找记录] 成功：', res)
            let introduce = res.result.data.introduce
            this._textFormat(introduce)
            this.setData({
                swiperIntro: res.result.data,
                introduce
            })
        }).catch((err) => {
            console.log('[轮播图详情][查找记录] 失败：', err)
        })
    },

    // 格式化文中段落
    _textFormat(text) {
        if (!text) {
            return
        }
        var reg = RegExp('\\\\n', 'g')
        return text.replace(reg, '\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})