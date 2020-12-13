const db = wx.cloud.database()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        image1: '',  // 本地身份证正面
        image2: '',  // 本地身份证背面
        realName: '',  // 真实姓名
        selectPhoto1: true,  // 添加图片元素是否显示
        selectPhoto2: true,  // 添加图片元素是否显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    // 身份证正面
    onChooseImage1() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                console.log('身份证正面: ', res)
                this.setData({
                    image1: res.tempFilePaths[0],
                    selectPhoto1: false
                })
            }
        })
    },
    // 身份证反面
    onChooseImage2() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                console.log('身份证背面: ', res)
                this.setData({
                    image2: res.tempFilePaths[0],
                    selectPhoto2: false
                })
            }
        })
    },
    onDelImage1() {
        this.setData({
            image1: this.data.image1,
            selectPhoto1: true
        })
    },
    onDelImage2() {
        this.setData({
            image2: this.data.image2,
            selectPhoto2: true
        })
    },
    onGetRealname(event) {
        this.setData({
            realName: event.detail.value
        })
    },
    // 保存
    onSaveProfile() {
        if (this.data.realName == '') {
            wx.showToast({
                title: '真实姓名不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (this.data.image1 == '') {
            wx.showToast({
                title: '身份证正面图片不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (this.data.image2 == '') {
            wx.showToast({
                title: '身份证背面图片不能为空',
                icon: 'none',
                duration: 2000
            })
        } else {
            // 异步处理图片上传
            let promiseArr = []
            let IDCposi = ''  // 云存储身份证正面
            let IDCnegi = ''  // 云存储身份证背面
            let username = wx.getStorageSync('username')
            let p1 = new Promise((resolve, reject) => {
                // 图片上传至云存储，每次只能上传一张
                wx.cloud.uploadFile({
                    cloudPath: 'profile/IDCposi' + '-' + username + '.jpg',
                    filePath: this.data.image1,
                    success: (res) => {
                        console.log('[身份证正面][图片上传] 成功：', res)
                        IDCposi = res.fileID
                        resolve()
                    },
                    fail: (err) => {
                        console.log('[身份证正面][图片上传] 失败：', err)
                        reject()
                    }
                })
            })
            promiseArr.push(p1)
            let p2 = new Promise((resolve, reject) => {
                wx.cloud.uploadFile({
                    cloudPath: 'profile/IDCnegi' + '-' + username + '.jpg',
                    filePath: this.data.image2,
                    success: (res) => {
                        console.log('[身份证背面][图片上传] 成功：', res)
                        IDCnegi = res.fileID
                        resolve()
                    },
                    fail: (err) => {
                        console.log('[身份证背面][图片上传] 失败：', err)
                        reject()
                    }
                })
            })
            promiseArr.push(p2)
            // console.log(promiseArr)
            // 存入到云数据库
            Promise.all(promiseArr).then((res) => {
                let username = wx.getStorageSync('username')
                wx.cloud.callFunction({
                    name: 'updateProfile',
                    data: {
                        realName: this.data.realName,
                        IDCposi: IDCposi,
                        IDCnegi: IDCnegi,
                        username: username
                    }
                }).then((res) => {
                    console.log('[个人资料][更新信息] 成功：', res)
                    wx.showToast({
                      title: '保存成功',
                    })
                    wx.navigateBack({
                        delta: 1,
                    })
                }).catch((err) => {
                    console.log('[个人资料][更新信息] 失败：', err)
                })
            })
        }
    }
})