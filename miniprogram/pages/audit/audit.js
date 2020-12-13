const db = wx.cloud.database()
const src = ''
Page({
    /**
     * 页面的初始数据
     */
    data: {
        auditInfo: [],
        status: '',
        src: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log('options: ', options)
        let username = options.username
        this.getStatus(username)
        this.getAuditInfo()
    },

    // 获取审核员信息
    getAuditInfo() {
        wx.cloud.callFunction({
            name: 'getAudit'
        })
        .then((res) => {
            console.log('[审核员信息][查找记录] 成功：', res)
            this.setData({
                auditInfo: res.result.data
            })
        })
    },

    // 获取用户账号状态
    getStatus(username) {
        db.collection('t_user_account').where(
            {
                username: username
            }).get()
        .then((res) => {
            console.log('[个人资料][查找信息] 成功：', res)
            this.setData({
                status: res.data[0].status
            })
            wx.setStorageSync('status', res.data[0].status)
        })
        .catch((err) => {
            console.log('[个人资料][查找信息] 失败：', err)
        })
    },

    // 长按保存功能-授权部分
    saveImage(e) {
        console.log('e: ', e)
        let _this = this
        wx.showActionSheet({
            itemList: ['保存到相册'],
            success(res) {
                let url = e.currentTarget.dataset.url;
                wx.getSetting({
                    success: (res) => {
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success: () => {
                                    // 同意授权
                                    _this.saveImgInner(url);
                                },
                                fail: (res) => {
                                    console.log(res);
                                    wx.showModal({
                                        title: '保存失败',
                                        content: '请开启访问手机相册权限',
                                        success(res) {
                                            wx.openSetting()
                                        }
                                    })
                                }
                            })
                        } else {
                            // 已经授权了
                            _this.saveImgInner(url);
                        }
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })   
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    // 长按保存功能--保存部分
    saveImgInner (url) {
        wx.getImageInfo({
            src: url,
            success: (res) => {
                let path = res.path;
                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success: (res) => {
                        console.log(res);
                        wx.showToast({
                            title: '已保存到相册',
                        })
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })
            },
            fail: (res) => {
                console.log(res);
            }
        })
    }
})