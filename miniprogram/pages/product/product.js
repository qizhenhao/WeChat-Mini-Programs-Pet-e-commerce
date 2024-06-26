// miniprogram/pages/product/product.js
import ProductService from '../../data_service/ProductService.js'
var productService = new ProductService();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {}, //当前商品
    productId: '', //当前商品id
    productNumber: 1, //决定购买的当前商品数
    cartNumber: 0, //购物车商品数
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({ 
      current: current, // 当前显示图片的http链接  
      urls: this.data.product.bigImg, // 需要预览的图片http链接列表  
      success:res=>{
        console.log(res);
      },
      fail:res=>{
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      productId: options.id
    })

    productService.getProductById(that.data.productId,
      function(productlist) {
        var productList = productlist;
        console.log(productList);
        that.setData({
          product: productList
        })
      })
      
    this.initCartNumber()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.initCartNumber()
    // 清空支付列表
    wx.setStorage({
      key: "paylist",
      data: [],
    })
    this.setData({
      productNumber: 1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //初始化购物车物品数
  initCartNumber: function() {
    var value = wx.getStorageSync('cart');
    this.setData({
      cartNumber: value.length
    })
  },
  onClickCartIcon: function() {
    wx.navigateTo({
      url: '../cart/cart',
    })
  },

  // 修改加入购物车数量按钮
  onNumberChange: function(e) {
    console.log(e);
    if (e.detail > this.data.product.storage) {
      Toast('该商品不能购买更多哦~');
      this.setData({
        productNumber: this.data.product.storage
      })
    } else {
      this.setData({
        productNumber: e.detail
      })
    }
  },
  onClickStoreIcon:function(){
      wx.navigateBack({
      delta: 0,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    });
  },
  // 点击立即购买按钮
  onClickBuyButton: function() {
    if(this.data.product.storage<=0)
    {
      wx.showToast({
        title: '已售空',
        icon:'error',
      })
      return;
    }
    let buyProduct = [{
      id: this.data.productId,
      productInfo: this.data.product,
      number: this.data.productNumber
    }]
    wx.setStorage({
      key: "paylist",
      data: buyProduct,
    })
    wx.navigateTo({
      url: `../pay/pay?mode=product`,
    })
  },

  // 点击加入购物车按钮
  onClickAddToCartButton: function() {
    if(this.data.product.storage<=0)
    {
      wx.showToast({
        title: '已售空',
        icon:'error',
      })
      return;
    }
    var that = this;
    var value = wx.getStorageSync('cart');
    console.log(value);
    let newProduct = {
      id: this.data.productId,
      number: this.data.productNumber
    }
    if (value) {
      //如果缓存中已经存在购物车数据
      //得到要添加的商品在购物车缓存中的索引号
      var addProductId = value.findIndex(e => e.id == newProduct.id);
      if (addProductId == -1) {
        //如果购物车数据中没有当前页面的商品，就将当前页面的商品添加到购物车数据的末尾
        value.unshift(newProduct);
        this.setData({
          cartNumber: this.data.cartNumber + 1
        })
        wx.setStorage({
          key: "cart",
          data: value,
        })
      } else {
        //根据索引号在购物车缓存中修改商品
        value[addProductId].number = value[addProductId].number + newProduct.number;
        //将最新的购物车数据更新到本地缓存
        wx.setStorage({
          key: "cart",
          data: value,
        })
      }
    } else {
      // 缓存中没有购物车数据
      value = [];
      value.push(newProduct);
      wx.setStorage({
        key: "cart",
        data: value,
      })
    }
    wx.showToast({
      title: '购物车添加成功', //toast 显示的内容
      icon: 'success', //toast的图标，模式有 success | loading | none，默认为 success
      duration: 2000, //toast 显示时长，单位为ms，默认值1500
      mask: true //是否显示透明蒙层，防止触摸穿透，默认为false
    })
  }
})