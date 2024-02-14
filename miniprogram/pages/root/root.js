// pages/root/root.js
import ProductService from '../../data_service/ProductService.js'
var productService = new ProductService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList : [],
  },
  //修改广告
  update_advertising(){
    wx.chooseMedia({
      count: 6,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res);
      }
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
    // productService.getAllProductList(true,res=>{
    //   console.log(res);
    //   this.setData({
    //     productList:res,
    //   })
    // })
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
    // productService.getAllProductList(false,res=>{
    //   console.log(res);
    //   this.setData({
    //     productList:res,
    //   })
    // })
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