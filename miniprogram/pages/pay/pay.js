// miniprogram/pages/pay/pay.js
import Toast from '@vant/weapp/toast/toast';
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chosenAddress: {}, //选择地址
    payList: [], //待支付商品列表
    mode: "product", //模式
    totalPrice: 0, //商品原价合计
    paymentFee: 0, //实际支付价格合计
    discount: 1, //折扣率
    user_open_id:'',
    distribution_fee:0,
    in_county_chao: 0,
    in_county_fee: 0,
    out_county_chao: 0,
    out_county_fee: 0,
    zai_fee:0,//满多少元可免配送费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var mode = options.mode
    var that = this;
    var app = getApp();
    var userinfo = app.globalData.userinfo;
    that.setData({
      chosenAddress : userinfo.address.userAddressList[userinfo.address.defaultAddress],
      user_open_id : userinfo.openid,
    })
    var total_price=0;
    var payList = wx.getStorageSync('paylist');
    console.log(payList);
    for(let i=0;i<payList.length;i++)
    {
      total_price+=payList[i].productInfo.price*payList[i].number;
    }
    if(this.data.chosenAddress.is_xian)
    {
      db.collection('distribution')
      .doc("3bbc6ba865d8574000c7014755cfd891")
      .get({
        success:res=>{
          console.log(res);
          if(total_price<res.data.in_county_chao)
          {
            this.setData({
              distribution_fee:res.data.in_county_fee,
              totalPrice:total_price,
              paymentFee:total_price+res.data.in_county_fee,
              zai_fee:res.data.in_county_chao
            })
          }
          else{
            this.setData({
              totalPrice:total_price,
              paymentFee:total_price,
            })
          }
          this.setData({
              in_county_chao: res.data.in_county_chao,
              in_county_fee: res.data.in_county_fee,
              out_county_chao: res.data.out_county_chao,
              out_county_fee: res.data.out_county_fee,
          })
        }
      })
    }
    else
    {
      db.collection('distribution')
      .doc("3bbc6ba865d8574000c7014755cfd891")
      .get({
        success:res=>{
          console.log(res);
          if(total_price<res.data.out_county_chao)
          {
            this.setData({
              distribution_fee:res.data.out_county_fee,
              totalPrice:total_price,
              paymentFee:total_price+res.data.out_county_fee,
              zai_fee:res.data.out_county_chao,
            })  
          }
          else{
            this.setData({
              totalPrice:total_price,
              paymentFee:total_price,
            })
          }
          this.setData({
            in_county_chao: res.data.in_county_chao,
            in_county_fee: res.data.in_county_fee,
            out_county_chao: res.data.out_county_chao,
            out_county_fee: res.data.out_county_fee,
        })
        }
      })
    }
    this.setData({
      payList: payList,
      mode: mode,
      
    })
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
    console.log("onShow!");
    var app = getApp();
    var userinfo = app.globalData.userinfo;
    this.setData({
      chosenAddress : userinfo.address.userAddressList[userinfo.address.defaultAddress],
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

  onChosenButtonClick: function(e) {
    wx.navigateTo({
      url: `../address/my-address/my-address`,
      
    })
  },

  // 提交订单 
  onSummitOrder: async function() {
    var that = this;
    
    for (var i in that.data.payList) {
      db.collection('product')
      .doc(that.data.payList[i].id)
      .get()
      .then(res=>{
        if(res.data.storage<that.data.payList[i].number)
        {
          wx.showToast({
            title: that.data.payList[i].productInfo.name+'库存量不足，请重新购买',
            duration:2000,
            icon:'error'
          })
          return;
        }
      })
    }
    var app = getApp();
    var userinfo = app.globalData.userinfo;
    console.log(userinfo);
    wx.cloud.callFunction({
      name:"payProduct",
      data:{
        user_id : userinfo._id,
        totalPrice:this.data.paymentFee,
      },
      success:res=>{
        console.log("回调成功",res);
        var payment = res.result.res.payment;
        wx.requestPayment({
          appId:payment.appId,
          nonceStr: payment.nonceStr,
          package: payment.package,
          paySign: payment.paySign,
          signType:payment.signType,
          timeStamp: payment.timeStamp,
          success:ress=>{
            console.log("支付成功",ress);
            this.create_order(res.result.res.payment,res.result.order_numer);
            this.deleteCartStorage(-1);
            wx.showLoading({
              title: '加载中',
              duration:2000,
              success:res=>{
                wx.reLaunch({
                  url: '../store/store',
                })
              },
            })
          },
          fail:res=>{
            console.log("支付失败",res);
            wx.showToast({
              title: '支付失败',
              icon:'error'
            })
          }
        })
        //给商家发送消息
        // this.create_order(res.result.res.payment,res.result.order_numer);
        //     this.deleteCartStorage(-1);
        //     wx.showLoading({
        //       title: '加载中',
        //       duration:2000,
        //       success:res=>{
        //         wx.reLaunch({
        //           url: '../store/store',
        //         })
        //       },
        //     })
      },
      fail:res=>{
        console.log("回调失败",res);
      },
    })
  },
  // 等待
  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  failToast: async function(content) {
    var str = content
    Toast(str);
    // 返回原页面
    await this.sleep(2000);
    wx.navigateBack()
  },

  // 删除购物车缓存
  deleteCartStorage: function(productIndex) {
    if(productIndex==-1)
    {
      wx.setStorage({
        key: 'cart',
        data: [],
      })
      return;
    }
    var productIndex = productIndex;
    var cart = wx.getStorageSync('cart');
    for (let i = 0; i < productIndex.length; i++) {
      //在缓存数据中查找到要删除的商品
      var index = cart.findIndex(e => e.id == productIndex[i])
      if (index > -1) {
        //根据索引号在购物车缓存中删除商品
        cart.splice(index, 1)
      }
    }
    wx.setStorage({
      key: 'cart',
      data: cart,
    })
  },
  create_order:function(payment,order_numer){
    console.log(payment);
    payment.timeStamp = new Date().getTime();
    var products = [];
    for(let i=0;i<this.data.payList.length;i++)
    {
      const prolist = this.data.payList[i];
      products.push({
        count:prolist.number,
        productInfo:{
          id:prolist.id,
          name: prolist.productInfo.name,
          price: prolist.productInfo.price,
          min_img:prolist.productInfo.miniImg,
          unit:prolist.productInfo.unit,
        }
      });
    }
    console.log(products);
    db.collection('order').add({
      data:{
        order_numer:order_numer,
        phone_shang:16627758811,
        user_id:this.data.user_open_id,
        payment:payment,
        distribution_fee:this.data.distribution_fee,
        Address:this.data.chosenAddress,
        complete:{
          is_comp:false,
          time_comp:'',
          is_detele:false,
        },
        products:products,
      },
      success:res=>{
        for(let i=0;i<this.data.payList.length;i++)
        {
          this.data.payList[i].productInfo.storage-=this.data.payList[i].number;
          wx.cloud.callFunction({
            name:'mod_product_strage',
            data:{
              id:this.data.payList[i].id,
              storage:this.data.payList[i].productInfo.storage,
            },
            success:res=>{
              console.log(res);
            },
            fail:res=>{
              console.log(res);
            },
          })
        }
      }
    })
  },
})