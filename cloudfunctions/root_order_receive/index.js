// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var db = cloud.database();
  await db.collection('order')
  .where({
    _id:event._id,
  })
  .update({
    data:{
      complete:{
        is_comp:event.is_comp,
        time_comp:event.time
      }
    },
    success:res=>{
    },
    fail:res=>{
    }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}