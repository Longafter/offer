var util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cateInfoList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log('options: ', options)
        let categoryName = options.categoryname
        this.getCateInfoList(categoryName)
    },

    // 获取分类信息列表
    getCateInfoList(categoryName) {
        wx.cloud.callFunction({
            name: 'getCateInfoList',
            data: {
                categoryName,
            }
        }).then((res) => {
            let time = util.formatTime(new Date())
            console.log('[分类列表][查找记录] 成功：', res)
            this.setData({
                cateInfoList: res.result.data,
                time,
            })
        }).catch((err) => {
            console.log('[分类列表][查找记录] 失败', err)
        })
    },

    // 进入猪详情页面
    _onGoToDetail(event) {
        // console.log('event: ', event)
        let pigId = event.currentTarget.dataset.id
        wx.navigateTo({
          url: `../../pages/pigDetail/pigDetail?pigid=${pigId}`,
        })
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