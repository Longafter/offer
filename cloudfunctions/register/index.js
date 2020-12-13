// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'hfmy-cloud-2gdpy3gr34d8c7f3'
})

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event: ', event)
    let username = event.username
    let mobile = event.mobile
    return await cloud.database().collection('t_user_account')
    .where({
        username: username,
        mobile: mobile
    })
    .get()
}