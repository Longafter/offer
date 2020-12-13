const db = wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        profile: [],
        status: '',  // 账号状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options: ', options)
        let username = options.username
        this.showProfile(username)
    },

    // 显示个人资料
    showProfile(username) {
        const _ = db.command
        db.collection('t_user_account').where(_.or([
            {
                username: username
            },
            {
                mobile: username
            }
        ])).get()
        .then((res) => {
            console.log('[个人资料][查找信息] 成功：', res)
            this.setData({
                profile: res.data[0],
                status: res.data[0].status
            })
            wx.setStorageSync('status', res.data[0].status)
        })
        .catch((err) => {
            console.log('[个人资料][查找信息] 失败：', err)
        })
    },

    onGoToProfile() {
        wx.navigateTo({
            url: '../profile/profile',
        })
    },

    onShow() {
        //  再次加载，实现页面刷新
        this.showProfile(wx.getStorageSync('username'))
    }
    
})