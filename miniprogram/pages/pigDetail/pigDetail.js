// pages/pigDetail/pigDetail.js
var util = require('../../utils/util.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        pigDetailInfo: {},
        time: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log('options: ', options)
        let pigId = options.pigid
        this.getPigDetail(pigId)
    },

    // 获取猪详情
    getPigDetail(pigId) {
        wx.cloud.callFunction({
            name: 'getPigDetail',
            data: {
                pigId,
            }
        }).then((res) => {
            console.log('[猪详情][查找记录] 成功', res)
            let time = util.formatTime(new Date())
            this.setData({
                pigDetailInfo: res.result.data,
                time
            })
        }).catch((err) => {
            console.log('[猪详情][查找记录] 失败', err)
        })
    },

    onGoToOffer(event) {
        // console.log('event: ', event)
        let username = wx.getStorageSync('username')
        let status = wx.getStorageSync('status')
        if (username) {
            if (status === '1') {
                let pigId = event.currentTarget.dataset.id
                wx.navigateTo({
                    url: `../../pages/offer/offer?pigid=${pigId}`,
                })
            } else if (status === '0') {
                wx.showToast({
                    title: '请通过报价资格申请后进行报价',
                    icon: 'none'
                })
                // 未完善个人资料时延迟两秒跳转至个人中心页
                // setTimeout(() => {
                //     wx.switchTab({
                //         url: '../my/my',
                //     })
                // }, 2000);
            } else {
                wx.showToast({
                    title: '你的账号已停用，请联系管理员解冻',
                    icon: 'none'
                })
            }
        } else {
            wx.showToast({
              title: '请登陆后进行报价',
              icon: 'none'
            })
            // 未登录时延迟两秒跳转至个人中心页
            setTimeout(() => {
                wx.switchTab({
                    url: '../my/my',
                })
            }, 2000);
        }
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