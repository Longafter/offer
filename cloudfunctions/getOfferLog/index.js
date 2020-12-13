// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'hfmy-cloud-2gdpy3gr34d8c7f3'
})

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('username: ', event.username)
    return await cloud.database().collection('t_offer')
    .where({
        username: event.username
    })
    .get()
    .then((res) => {
        console.log('[报价][查询记录] 成功：', res)
    })
    .catch((err) => {
        console.log('[报价][查询记录] 失败：', err)
    })
}