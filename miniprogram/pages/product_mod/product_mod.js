// pages/product_mod/product_mod.js
import ProductService from '../../data_service/ProductService.js'
var productService = new ProductService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[],
    isNoMoreData:false,
  },
  to_product_mod_add(e){
    var _id = e.target.id;
    wx.navigateTo({
      url: '../product_mod_add/product_mod_add?id='+_id,
    })
  },

  getProductList: function(isPull) {
    console.log(isPull);
    if(this.data.isNoMoreData===true){
      wx.showToast({
        title: '商品已加载完',
        duration: 500,
      })
      return;
    }
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    productService.getAllProductList(isPull,
    function(productArray) {
      if (productArray.length <= 0) {
        that.setData({
        isNoMoreData: true //设置数据全部加载完毕的标志
        })
      }
      else{
        var temp = that.data.productList;
        for(let i=0;i<productArray.length;i++)
          temp.push(productArray[i]);
        that.setData({
          productList: temp, //设置数据全部加载完毕的标志
        })
      }
      wx.hideNavigationBarLoading() //完成停止加载
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getProductList(true);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(this.data);
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
    this.getProductList(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})