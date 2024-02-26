// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
var db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {  
    const res = (await db.collection('user').where({  
      openid: event.user_id // 确保字段名正确  
    }).get());  
    if (res.data.length === 0) {  
      return { res: null, code: -1, message: 'No order found for the given ID.' }  
    } else {  
      return { res: res.data[0].userPhoneInfo.phoneNumber, code: 0 }  
    }  
  } catch (err) {  
    // 处理错误情况  
    console.error(err)  
    return { res: err, code: -2 }  
  }  
}