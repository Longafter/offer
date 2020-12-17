// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'hfmy-cloud-2gdpy3gr34d8c7f3'
})

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event: ', event)
    return await cloud.database().collection('t_offer').add({
        data: {
            username: event.username,
            number: event.number,
            price: event.price,
            pigId: event.pigId,
            campany: event.offerPigInfo.campany,
            end_time: event.offerPigInfo.end_time,
            category: event.offerPigInfo.category,
            varityes: event.offerPigInfo.varityes,
            sale_place: event.offerPigInfo.sale_place,
            telephone: event.offerPigInfo.telephone,
            createTime: cloud.database().serverDate()
        }
    })
}