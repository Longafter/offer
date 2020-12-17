// 云函数入口文件
const cloud = require('wx-server-sdk')
const QcloudSms  = require('qcloudsms_js')
const appid = '1400463225'
const appkey = 'a55b0fb93d9808b05ba2d7d86b9796fc'
const smsSign = '安徽禾丰牧业'  // 短信签名
const qcloudsms  = QcloudSms(appid, appkey)

cloud.init({
  env: 'hfmy-cloud-2gdpy3gr34d8c7f3'
})

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  console.log('event: ', event)
  let templateid = '814294'  // 注册认证短信模板id
  let sender = qcloudsms.SmsSingleSender()
  let params = [event.code, 2]
  sender.sendWithParam(
    86,  // 中国区号
    event.mobile,  // 要发送的手机号
    templateid,  // 注册认证短信模板id
    params,  // 要发送的验证码，有效时间
    smsSign,  // 短信签名
    '', '',
    (err, res, resData) => {
      if (err) {
        reject({err})
      } else {
        resolve({
          res: res.req,
          resData
        })
      }
    }
  )
})