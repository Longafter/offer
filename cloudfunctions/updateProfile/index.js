// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'hfmy-cloud-2gdpy3gr34d8c7f3'
})

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event: ', event)
    return await cloud.database()
    .collection('t_user_account')
    .where({
        username: event.username
    })
    .update({
        data: {
            realName: event.realName,
            IDCposi: event.IDCposi,
            IDCnegi: event.IDCnegi
        }
    }).then((res) => {
        console.log('[个人资料][更新信息] 成功：', res)
    }).catch((err) => {
        console.log('[个人资料][更新信息] 失败：', err)
    })
}