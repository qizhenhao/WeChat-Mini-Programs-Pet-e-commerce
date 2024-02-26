// 初始化 云数据库
const db = wx.cloud.database()
const _ = db.command

class ProductService {
  /**
   * 构造函数
   */
  constructor() {
    this.listIndex = 0 //分页获取数据的当前页索引
    this.pageCount = 8 //每次分页获取多少数据
  }
  
  //上传多张照片
  update_img(cloudPath,file_list,successback){
    var code_list = [];
    var index=0;
    this.update_img_index(index,cloudPath,file_list,successback,code_list);
  }

  update_img_index(index,cloudPath,file_list,successback,code_list){
    if(index===file_list.length)
      successback(code_list);
    else{
      wx.cloud.uploadFile({  
        cloudPath: "product/"+cloudPath+'/'+cloudPath+index+file_list[index].tempFilePath.match(/\.[^.]+?$/)[0],  
        filePath: file_list[index].tempFilePath, // 文件路径  
        success: res => {  
          code_list.push(res.fileID);
          this.update_img_index(index+1,cloudPath,file_list,successback,code_list);
        },  
        fail:res=>{
          console.log("失败的",index);
        }
      })
    }
  }
  //--------------
  //获取广告
  getadvertising(fun){
    db.collection('advertising')
      .where({
        _id:"65ee49bb65cb330e006ca48937f9a997",
      })
      .get({
        success:res=>{
          console.log("res:",res);
          fun(res.data[0].Advertising);
        },
        fail:res=>{
          console.log("fail:Get Advertising");
        },
      })
  }
  //添加商品
  add_product(new_product){
    db.collection('product').add({
      data:new_product,
      success:res=>{
        console.log(res);
      },
    });
  }
  //删除商品
  detele_product(_id){
    db.collection('product')
    .doc(_id)
    .remove()
    .then(res=>{
      console.log(res);
    })
    .catch(res=>{
      console.log(res);
    });
  }
  //改变商品信息
  updata_product(_id,new_product){
    wx.cloud.callFunction({
      name: 'updata_product',
      data:{
        _id:_id,
        new_product:new_product
      },
      success:res=>{
        console.log(res);
      }
    })
  }
  // 根据商品id获取商品 (callback)
  getProductById(id, successCallback) {
    db.collection('product').where({
        _id: id
      }).get()
      .then(res => {
        if (res.data.length > 0) {
          //回调函数处理数据查询结果
          typeof successCallback == "function" && successCallback(res.data[0]);
        } else {
          //跳转出错页面
          wx.redirectTo({
            url: '../../errorpage/errorpage'
          })
        }
      })
      .catch(err => {
        //跳转出错页面
        wx.redirectTo({
          url: '../../errorpage/errorpage'
        })
        console.error(err)
      })
  }

  // 根据商品id获取商品 (promise)
  getCartProductList(id) {
    return new Promise((resolve, reject) => {
      db.collection('product').where({
        _id: id
      }).get().then(res => {
        console.log("getcartProductList",res);
        if (res.data.length > 0) {
          resolve(res.data[0])
        } else {
          let flag = false
          resolve(flag)
        }
      })
    })
  }

  // 获取全部商品列表
  getAllProductList(isReset, successCallback) {
    var query = db.collection('product');
    this.pullDataWithQuery(query, isReset, successCallback);
  }

  // 根据关键词获取商品列表
  getProductListByKeyword(keyword, isReset, successCallback) {
    var query = db.collection('product').where({
      name: db.RegExp({
        regexp: '.*' + keyword + '.*',
        options: 'i',
      })
    })
    this.pullDataWithQuery(query, isReset, successCallback);
  }

  // 根据商品类别获取商品
  getProductListByCategory(category, isReset, successCallback) {
    var query = db.collection('product').where({
      category: category
    })
    this.pullDataWithQuery(query, isReset, successCallback);
  }

  // 根据query拉取数据库数据
  pullDataWithQuery(query, isReset, successCallback) {
    var productArray = [];

    if (isReset) {
      //重置分页为初始值
      this.listIndex = 0
      this.pageCount = 8
    };
    //构造分页
    var offset = this.listIndex * this.pageCount
    //skip和limit的传入参数必须大于0
    if (offset === 0) {
      query = query
        .limit(this.pageCount) //限制返回数量为 max 条
    } else {
      query = query
        .skip(offset) // 跳过结果集中的前 offset 条，从第 offset + 1 条开始返回
        .limit(this.pageCount) //限制返回数量为 max 条
    }
    var that = this
    //执行数据库查询
    query
      .get()
      .then(res => {
        if (res.data.length > 0) {
          //构造用于瀑布流显示的商品列表数据
          for (var i in res.data) {
  
            productArray.push({
              id: res.data[i]._id,
              name: res.data[i].name,
              miniImg: res.data[i].miniImg,
              bigImg: res.data[i].bigImg,
              detail: res.data[i].detail,
              price: res.data[i].price,
              category: res.data[i].category,
              unit: res.data[i].unit,
              storage:res.data[i].storage,
            });
          }
          //分页显示的页码+1
          ++that.listIndex;
        }
        //回调函数处理数据查询结果
        typeof successCallback == "function" && successCallback(productArray)
      }).catch(err => {
        //跳转出错页面
        wx.redirectTo({
          url: '../../errorpage/errorpage'
        })
        console.error(err)
      })
  }
}

export default ProductService;