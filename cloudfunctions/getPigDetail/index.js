// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'hfmy-cloud-2gdpy3gr34d8c7f3'
})

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event: ', event)
    let pigId = event.pigId
    return await cloud.database().collection('t_pig_info')
    .doc(pigId)
    .get()
}