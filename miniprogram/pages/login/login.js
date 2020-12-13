// pages/mine/mine.js
const db = wx.cloud.database()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        mobile: '',
        company: '',
        complace: '',
        pass1: '',
        pass2: '',
        status: '0'  // 账号状态：0-待审核；1-审核通过；-1-停用
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // username失去焦点
    _handleUsername(e) {
        // console.log('e: ', e)
        this.setData({
            username: e.detail.value
        })
    },

    // mobile失去焦点
    _handleMobile(e) {
        // console.log('e: ', e)
        this.setData({
            mobile: e.detail.value
        })
    },

    // company失去焦点
    _handleCompany(e) {
        // console.log('e: ', e)
        this.setData({
            company: e.detail.value
        })
    },

    // camplace失去焦点
    _handleComplace(e) {
        // console.log('e: ', e)
        this.setData({
            complace: e.detail.value
        })
    },

    // pass1失去焦点
    _handlePass1(e) {
        // console.log('e: ', e)
        this.setData({
            pass1: e.detail.value
        })
    },

    // pass2失去焦点
    _handlePass2(e) {
        // console.log('e: ', e)
        this.setData({
            pass2: e.detail.value
        })
    },
    
    // 注册
    bindGetUserInfo(event) {
        console.log('event: ', event)
        if (event.detail.userInfo) {
            // 用户允许授权
            wx.showLoading({
              title: '正在注册...',
            })
            if (this.data.username == '') {
                wx.showToast({
                  title: '用户名不能为空',
                  icon: 'none',
                  duration: 2000
                })
            } else if (this.data.mobile == '') {
                wx.showToast({
                  title: '手机号不能为空',
                  icon: 'none',
                  duration: 2000
                })
            } else if (this.data.company == '') {
                wx.showToast({
                  title: '单位名称不能为空',
                  icon: 'none',
                  duration: 2000
                })
            }  else if (this.data.complace == '') {
                wx.showToast({
                  title: '单位地址不能为空',
                  icon: 'none',
                  duration: 2000
                })
            }  else if (!(/^1[3456789]\d{9}$/.test(this.data.mobile))) {
                wx.showToast({
                    title: '手机号码格式有误，请重新输入！',
                    icon: 'none',
                    duration: 2000
                })
            } else if (this.data.pass1 == '') {
                wx.showToast({
                    title: '密码不能为空',
                    icon: 'none',
                    duration: 2000
                })
            } else if (this.data.pass2 == '') {
                wx.showToast({
                    title: '请再次输入密码',
                    icon: 'none',
                    duration: 2000
                })
            } else if (this.data.pass1 != this.data.pass2) {
                wx.showToast({
                    title: '两次密码输入不一致，请重新输入！',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                db.collection('t_user_account').where({
                    username: this.data.username
                })
                .get()
                .then((res) => {
                    console.log('[注册][查找记录] 成功：', res)
                    // 判断用户名是否被注册过，为空说明没查询到，即没有注册
                    if (res.data.length == 0) {
                        db.collection('t_user_account').where({
                            mobile: this.data.mobile
                        })
                        .get()
                        .then((res) => {
                            if (res.data.length == 0) { //判断手机号是否被注册过，等于空说明没被查询到，就是没有注册过，
                                // 获取当前时间，写入数据库，可以知道此账号是何时创建
                                var myDate = new Date()
                                var y = myDate.getFullYear()
                                var m = myDate.getMonth() + 1
                                var d = myDate.getDate()
                                var h = myDate.getHours()
                                var ms = myDate.getMinutes()
                                var s = myDate.getSeconds()
                                var time = y + '-' + m + '-' + d + ' ' + h + ':' + ms + ':' + s
                                db.collection('t_user_account').add({
                                    data: {
                                        username: this.data.username,
                                        mobile: this.data.mobile,
                                        company: this.data.company,
                                        complace: this.data.complace,
                                        pass1: this.data.pass1,
                                        time: time,
                                        status: this.data.status
                                    }
                                }).then((res) => {
                                    console.log(res)
                                    if (res.errMsg == 'collection.add:ok') {
                                        wx.hideLoading()
                                        wx.showToast({
                                            title: '注册成功',
                                            icon: 'none'
                                        })
                                        wx.switchTab({
                                          url: '../my/my',
                                        })
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: '此手机号已被别人注册，换一个试试！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '此用户名已被别人注册，换一个试试！',
                            icon: 'none',
                            duration: 2000
                          })
                    }
                }).catch((err) => {
                    console.log('[注册][查找记录] 失败：', err)
                })
            }
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进行账号注册，请授权之后再注册!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {}
            })
        }
    }
})