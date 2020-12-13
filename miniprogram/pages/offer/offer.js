var util = require('../../utils/util.js');
const db = wx.cloud.database()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        offerPigInfo: {},
        number: '',
        price: '',
        rank: '',
        userNum: '',
        lastOffer: '',  // 上次报价
        lastRank: '',  // 上次排名
        lastRankList: [],  // 上次排名列表
        disable: false,  // 报价按钮是否可点击
        time: ''   // 倒计时
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log('options: ', options)
        let pigId = options.pigid
        this.getOffer(pigId)
    },

    // 获取报价猪信息
    getOffer(pigId) {
        wx.cloud.callFunction({
            name: 'getPigDetail',
            data: {
                pigId,
            }
        }).then((res) => {
            console.log('[报价猪详情][查找记录] 成功', res)
            this.setData({
                offerPigInfo: res.result.data
            })
            this.getLastOffer()
        }).catch((err) => {
            console.log('[报价猪详情][查找记录] 失败', err)
        })
    },

    getPrice(event) {
        this.setData({
            price: event.detail.value
        })
    },

    getNumber(event) {
        this.setData({
            number: event.detail.value
        })
    },

    // 报价
    onGetOffer(event) {
        // console.log('event:', event)
        if(this.data.price == '') {
            wx.showToast({
                title: '报价不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if(this.data.number == '') {
            wx.showToast({
                title: '购买数量不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if(parseInt(this.data.number) > this.data.offerPigInfo.num) {
            wx.showToast({
                title: `购买数量不能超出${this.data.offerPigInfo.num}头`,
                icon: 'none',
                duration: 2000
            })
        } else {
            // 将所有数据添加到't_offer_all'中
            let username = wx.getStorageSync('username')
            let time = util.formatTime(new Date())
            db.collection('t_offer_all').add({
                data: {
                    pigId: this.data.offerPigInfo._id,
                    category: this.data.offerPigInfo.category,
                    varieties: this.data.offerPigInfo.varieties,
                    avg_widgt: this.data.offerPigInfo.avg_widgt,
                    listing_price: this.data.offerPigInfo.listing_price,
                    base_price: this.data.offerPigInfo.base_price,
                    base_widgt: this.data.offerPigInfo.base_widgt,
                    num: this.data.offerPigInfo.num,
                    company: this.data.offerPigInfo.company,
                    sale_place: this.data.offerPigInfo.sale_place,
                    telphone: this.data.offerPigInfo.telphone,
                    price: event.currentTarget.dataset.price,
                    number: event.currentTarget.dataset.number,
                    username: username,
                    createTime: time
                }
            }).then((res) => {
                console.log('[报价总信息][插入记录] 成功：', res)
                wx.showToast({
                    title: '报价成功',
                })
                this.getLastOffer()
                this.offerRank()

                // 设置10s后再继续报价
                let that = this
                let seconds = 10
                let timer = setInterval(function () {
                    seconds--
                    if (seconds <= 0) {
                        clearInterval(timer)
                        that.setData({
                            disable: false
                        })
                    } else {
                        that.setData({
                            time: seconds + '秒',
                            disable: true
                        })
                    }
                }, 1000)
            }).catch((err) => {
                console.log('[报价总信息][插入记录] 失败：', err)
            })

            // 将同一数据的最新一条更新到't_offer'中
            db.collection('t_offer').where({
                username: username,
                pigId: this.data.offerPigInfo._id
            })
            .get()
            .then((res) => {
                console.log('[报价信息][查询记录] 成功：', res)
                if (res.data.length == 0) {
                    db.collection('t_offer').add({
                        data: {
                            pigId: this.data.offerPigInfo._id,
                            category: this.data.offerPigInfo.category,
                            varieties: this.data.offerPigInfo.varieties,
                            avg_widgt: this.data.offerPigInfo.avg_widgt,
                            listing_price: this.data.offerPigInfo.listing_price,
                            base_price: this.data.offerPigInfo.base_price,
                            base_widgt: this.data.offerPigInfo.base_widgt,
                            num: this.data.offerPigInfo.num,
                            company: this.data.offerPigInfo.company,
                            sale_place: this.data.offerPigInfo.sale_place,
                            telphone: this.data.offerPigInfo.telphone,
                            price: event.currentTarget.dataset.price,
                            number: event.currentTarget.dataset.number,
                            username: username,
                            createTime: time
                        }
                    }).then((res) => {
                        console.log('[报价新信息][插入记录] 成功：', res)
                        this.getLastOffer()
                    })
                } else {
                    wx.cloud.callFunction({
                        name: 'updateOffer',
                        data: {
                            pigId: this.data.offerPigInfo._id,
                            username: username,
                            price: event.currentTarget.dataset.price,
                            number: event.currentTarget.dataset.number,
                            createTime: time
                        }
                    }).then((res) => {
                        console.log('[报价新信息][更新记录] 成功：', res)
                        this.getLastOffer()
                    }).catch((err) => {
                        console.log('[报价新信息][更新记录] 失败：', err)
                    })
                }
            })
        }
    },

    // 上次报价
    getLastOffer() {
        db.collection('t_offer_all').where({
            username: wx.getStorageSync('username'),
            pigId: this.data.offerPigInfo._id
        })
        .orderBy('createTime', 'desc')
        .get()
        .then((res) => {
            console.log('[上次报价][查找信息] 成功: ', res)
            if (res.data.length > 0) {
                this.setData({
                    lastOffer: res.data[0].price
                })
            }
        })
    },

    // 获取上次排名
    getLastRank() {
        console.log('lastRankList: ', this.data.lastRankList)
        console.log('rank: ', this.data.rank)
        this.setData({
            lastRankList: this.data.lastRankList.concat(this.data.rank)
        })
        let length = this.data.lastRankList.length
        let lastRank = this.data.lastRankList[length - 2]
        console.log('lastRank: ', lastRank)
        this.setData({
            lastRank: lastRank
        })
    },

    // 当前排名--报完一次价查询数据库进行排名
    offerRank() {
        wx.cloud.callFunction({
            name: 'getOfferRank',
            data: {
                pigId: this.data.offerPigInfo._id
            }
        }).then((res) => {
            console.log('[报价排名][查找信息] 成功: ', res)
            let userNum = res.result.data.length
            let username = wx.getStorageSync('username')
            for (let i = 0; i < userNum; i++) {
                if (res.result.data[i].price == this.data.lastOffer & res.result.data[i].username == username) {
                    // console.log('i + 1: ', (i + 1))
                    this.setData({
                        userNum: userNum,
                        rank: (i + 1)
                    })
                    this.getLastRank()
                    break
                }
            }
        })
    }
})