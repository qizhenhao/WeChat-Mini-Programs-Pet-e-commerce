// pages/product_mod_add/product_mod_add.js
import ProductService from '../../data_service/ProductService.js'
var productService = new ProductService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorys:[
      {
        name:"食品",
        eng_name:"food"
      },
      {
        name:"玩具",
        eng_name:"toy"
      },
      {
        name:"清洁",
        eng_name:"cleaner"
      },
      {
        name:"医疗",
        eng_name:"medical"
      },
      {
        name:"用品",
        eng_name:"tool"
      }],
    tempFilePath_min:"",
    tempFilePath_big:[],
    min_check:false,
    big_check:false,
    new_product:{},
    old_product:{},
    id:-1,
    detele_id:false,
  },
update_minimg(){
  var that = this;
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    camera: 'back',
    success(res) {
      console.log(res);
      that.setData({
        tempFilePath_min:res.tempFiles[0].tempFilePath,
        min_check:true,
      });
    },
  });
},
update_bigimg(){
  var that = this;
  wx.chooseMedia({
    count: 6,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    camera: 'back',
    success(res) {
      console.log(res);
      that.setData({
        tempFilePath_big:res.tempFiles,
        big_check:true,
      });
    },
  });
},
nicknameInput(e){
  this.setData({
    'new_product.name':e.detail.value,
  });
},
nickunitInput(e){
  this.setData({
    'new_product.unit':e.detail.value,
  });
},
nickdetailInput(e){
  this.setData({
    'new_product.detail':e.detail.value,
  });
},
leibieChange(e){
  for(let i=0;i<this.data.categorys.length;i++)
  {
    if(this.data.categorys[i].name===e.detail.value)
    {
      this.setData({
        'new_product.category':this.data.categorys[i].eng_name,
      });
    }
  }
},
onNumberChange_jiage(e){
  this.setData({
    'new_product.price':e.detail,
  });
},
onNumberChange_kucun(e){
  this.setData({
    'new_product.storage':e.detail,
  });
},
submit(){

  if(this.data.detele_id){
    // min_check:false,
    // big_check:false,
    if(this.data.min_check===false&&this.data.big_check===false)
    {
      productService.updata_product(this.data.id,this.data.new_product);
    }
    else if(this.data.min_check===true&&this.data.big_check===false)
    {
      wx.cloud.uploadFile({  
        cloudPath: "product/"+this.data.new_product.name+'/'+this.data.new_product.name+'_min'+this.data.tempFilePath_min.match(/\.[^.]+?$/)[0],  
        filePath: this.data.tempFilePath_min, // 文件路径  
        success: res => {  
          this.data.new_product.miniImg = res.fileID;
          productService.updata_product(this.data.id,this.data.new_product);
        },  
      })
    }
    else if(this.data.min_check===false&&this.data.big_check===true)
    {
      productService.update_img(this.data.new_product.name,this.data.tempFilePath_big,e=>{
        this.data.new_product.bigImg = e;
        productService.updata_product(this.data.id,this.data.new_product);
      });
    }
    else
    {
      wx.cloud.uploadFile({  
        cloudPath: "product/"+this.data.new_product.name+'/'+this.data.new_product.name+'_min'+this.data.tempFilePath_min.match(/\.[^.]+?$/)[0],  
        filePath: this.data.tempFilePath_min, // 文件路径  
        success: res => {  
          this.data.new_product.miniImg = res.fileID;
          productService.update_img(this.data.new_product.name,this.data.tempFilePath_big,e=>{
            console.log(e);
            this.data.new_product.bigImg = e;
            productService.updata_product(this.data.id,this.data.new_product);
          });
        },  
      })
    }
  }
  else{
    wx.cloud.uploadFile({  
      cloudPath: "product/"+this.data.new_product.name+'/'+this.data.new_product.name+'_min'+this.data.tempFilePath_min.match(/\.[^.]+?$/)[0],  
      filePath: this.data.tempFilePath_min, // 文件路径  
      success: res => {  
        this.data.new_product.miniImg = res.fileID;
        productService.update_img(this.data.new_product.name,this.data.tempFilePath_big,e=>{
          console.log(e);
          this.data.new_product.bigImg = e;
          productService.add_product(this.data.new_product);
        });
      },  
    })
  }
  wx.navigateBack();
},
detele_product(){
  productService.detele_product(this.data.id);
  wx.navigateBack();
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.id = options.id;
    if(options.id!=-1)
    {
      productService.getProductById(this.data.id,e=>{
        this.setData({
          old_product:e,
          new_product:e,
          detele_id:true,
        });
        console.log(this.data.new_product);
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})