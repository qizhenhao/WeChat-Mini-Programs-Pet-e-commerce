const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
/**
 * 商城支付接口，支付积分购买商品
 * @param {data} 要购买的商品信息
 * {
 *    data:{
 *      productsIndex,    //[] 用户购买的商品的商品ID数组
 *      address,      //{}用户收货地址
 *      payList, //用户购买列表
 *    }
 *  }
 * @return {object} 支付结果
 * {
 *    data,    //bool 支付成功或失败
 *    errMsg   //如果支付失败，该字段包含支付失败的具体错误信息
 * }
 */
exports.main = async(event, context) => {
  var user_id = event.user_id;
  var time_str = new Date().getTime();
  var order_numer = String(user_id)+time_str;
  order_numer = order_numer.slice()

  const lengthToSlice = 30;
  // 确保截取的长度不会超过字符串本身的长度
  var startIndex = Math.max(order_numer.length - lengthToSlice, 0);
  var order_numer = order_numer.slice(startIndex);

  let res = await cloud.cloudPay.unifiedOrder({
    body: "宠物用品生活馆",
    detail:'宠物用品',
    outTradeNo: order_numer,
    spbillCreateIp: "127.0.0.1",
    subMchId: 
    totalFee: event.totalPrice*100,
    envId: 
    functionName: "pay_cb",
  });
  return {res:res,order_numer:order_numer};
  // console.log(event)
  // const wxContext = cloud.getWXContext()
  // //设置支付接口返回结果的默认值
  // var result = false
  // var errMsg = ''
  // // 订单信息
  // var payList = event.payList
  // // 用户收货地址
  // var address = event.address
  // //----------------------------------------------------------begin
  // //读取用户信息
  // var user = (await db.collection('user')
  //   .where({
  //     //云函数是在服务端操作，对所有用户的数据都有操作权限
  //     //在云函数中查询用户数据，需要添加openid的查询条件
  //     openid: wxContext.OPENID
  //   })
  //   .get()).data[0]
  
  //   //向订单记录表中插入一条新记录，记录本次支付的商品与订单信息
  //   //插入记录后获得插入的订单记录 ID
  //   var orderId = (await db.collection('user_order')
  //     .add({
  //       data: {
  //         _openid: wxContext.OPENID, //openid
  //         date: db.serverDate(), //购买商品时间
  //         productsIndex: event.productsIndex, //用户购买的商品 ID 数组
  //         payList: payList, //用户购买商品信息
  //         address: address, //用户收货地址
  //         totalPrice: totalPrice, //商品原价合计
  //         paymentFee: paymentFee, //实际支付价格合计
  //         discount: discount, //折扣率
  //         status: 'paid', //订单状态
  //       }
  //     }))._id

  //   //----------------------------------------------------------end

  //   //----------------------------------------------------------begin
  //   // 更新商品库存信息(支付成功的情况下)
  //   if (result == true) {
  //     for (let i = 0; i < payList.length; i++) {
  //       let productId = payList[i].id;
  //       let newStorage = payList[i].productInfo.storage - payList[i].number;
  //       await db.collection('product')
  //         .where({
  //           id: productId
  //         })
  //         .update({
  //           data: {
  //             storage: newStorage
  //           }
  //         })
  //     }
  //   }
  //   //----------------------------------------------------------end
  // //返回支付结果
  // return {
  //   data: result,
  //   errMsg: errMsg
  // }
}

//保留n位小数
function roundFun(value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}
