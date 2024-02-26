// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  await db.collection('advertising').where({
    _id:"65ee49bb65cb330e006ca48937f9a997"
  }).update({
    data:{
      'Advertising' : event.new_Adver,
    }
  });
  return true;
}