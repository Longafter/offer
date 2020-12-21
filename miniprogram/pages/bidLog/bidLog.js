const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected1: true,
    selected2: false,
    selected3: false,
    bidLogList: [],
    bid: '-1'  // 是否中标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let username = options.username
    this.showBid(username, '1')
  },

  showBid(username, bid) {
      db.collection('t_offer').where({
          username: username,
          bid: bid
      })
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
          console.log('[中标][查询记录] 成功：', res)
          this.setData({
              bidLogList: res.data
          })
      })
      .catch((err) => {
          console.log('[中标][查询记录] 失败：', err)
      })
  },

  // 中标
  _handleGetBid() {
      this.setData({
        selected1: true,
        selected2: false,
        selected3: false
      })
      this.showBid(wx.getStorageSync('username'), '1')
  },

  // 未中标
  _handleNoBid() {
    this.setData({
      selected1: false,
      selected2: true,
      selected3: false
    })
    this.showBid(wx.getStorageSync('username'), '-1')
  },

  //
  // _handleGoOn() {
  //   this.setData({
  //     selected1: false,
  //     selected2: false,
  //     selected3: true
  //   })
  //   this.showBid(wx.getStorageSync('username'), '0')
  // },

    // 跳转至猪只详情页
    onGoToPigInfo(event) {
      console.log('event:', event)
      let pigId = event.currentTarget.dataset.pigid
      wx.navigateTo({
        url: `../../pages/pigDetail/pigDetail?pigid=${pigId}`,
      })
  }
})