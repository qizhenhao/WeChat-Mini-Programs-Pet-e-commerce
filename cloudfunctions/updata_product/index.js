// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
var db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var _id = event._id;
  var new_product = event.new_product;
  await db.collection('product')
  .doc(_id)
  .update({
    data:{
      bigImg:new_product.bigImg,
      category:new_product.category,
      detail:new_product.detail,
      miniImg:new_product.miniImg,
      name:new_product.name,
      price:new_product.price,
      storage:new_product.storage,
      unit:new_product.unit,
    }
  })
  .then(res=>{
    console.log(res);
  })
  .catch(res=>{
    console.log(res);
  });
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}