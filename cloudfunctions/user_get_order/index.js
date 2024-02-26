// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { pageSize = 10, pageIndex = 1 } = event // 从事件对象中获取分页参数，默认为每页10条，第一页  
  
  try {  
    const db = cloud.database() // 初始化数据库  
    const collection = db.collection('order') // 获取orders集合的引用  
  
    // 执行分页查询  
    const result = await collection
      .where({user_id:wxContext.OPENID})
      .orderBy('payment.timeStamp', 'desc')  
      .skip((pageIndex - 1) * pageSize) // 跳过前面的文档，实现分页效果  
      .limit(pageSize) // 限制返回的文档数量，即每页显示的数量  
      .get() // 执行查询，获取结果  

    return {  
      code: 0,  
      message: '查询成功',  
      data: result.data // 返回查询结果的数据部分  
    }  
  } catch (error) {  
    console.error(error)  
    return {  
      code: -1,  
      message: error 
    }  
  }  
}