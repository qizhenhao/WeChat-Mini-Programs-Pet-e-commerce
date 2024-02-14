// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  //查询用户是否已注册
  var queryResult = (await db.collection('root')
    .where({
      //云函数是在服务端操作，对所有用户的数据都有操作权限
      //在云函数中查询用户数据，需要添加openid的查询条件
      open_id: wxContext.OPENID
    })
    .count()).total;

  //如果用户还未注册，自动注册（即在 user 表中添加该用户信息）
  if (queryResult > 0) {
    return true;
  }
  return false;
}