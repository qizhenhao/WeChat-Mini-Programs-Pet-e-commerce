// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('user').where({
    openid: wxContext.OPENID
  }).update({
    data: {
      address: event.Address,
    }
  })
}

