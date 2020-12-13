const db = wx.cloud.database()
const $ = db.command.aggregate

Page({
    /**
     * 页面的初始数据
     */
    data: {
        offerLogList: [],
        hasOfferLog: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options: ',options)
        let username = options.username
        this.showOffer(username)
    },

    showOffer(username) {
        db.collection('t_offer').where({
            username: username
        })
        .orderBy('createTime', 'desc')
        .get()
        .then((res) => {
            console.log('[报价][查询记录] 成功：', res)
            if (res.data.length == 0) {
                this.setData({
                    hasOfferLog: false
                })
            } else {
                this.setData({
                    offerLogList: res.data,
                    hasOfferLog: true
                })
            }
        })
        .catch((err) => {
            console.log('[报价][查询记录] 失败：', err)
        })
    },

    // 跳转至猪只详情页
    onGoToPigInfo(event) {
        console.log('event:', event)
        let pigId = event.currentTarget.dataset.pigid
        wx.navigateTo({
          url: `../../pages/pigDetail/pigDetail?pigid=${pigId}`,
        })
    }
})