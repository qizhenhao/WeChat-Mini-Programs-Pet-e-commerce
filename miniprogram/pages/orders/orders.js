// miniprogram/pages/orders/orders.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],  
    is_order:true,
    is_stat:true,
  },
  navigateToOrderDetails: function(event) {  
    var orderId = event.currentTarget.dataset.orderid;  
    wx.navigateTo({  
      url: '/pages/order/order?orderId=' + orderId  
    }); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var order_temp = [];
    var app = getApp();
    var userinfo = app.globalData.userinfo;
    console.log(userinfo);
    if(userinfo.openid===undefined)
    {
      this.setData({
        is_stat:false,
      })
      return;
    }
    db.collection('order')
    .where({
      _openid:userinfo.openid,
    })
    .orderBy('payment.timeStamp', 'desc')
    .get({
      success:res=>{
        console.log("res:");
        console.log(res);
        order_temp = res.data;
        // order_temp.sort((a,b)=>b.payment.timeStamp-a.payment.timeStamp);
        for(let i=0;i<order_temp.length;i++)
        {
          order_temp[i].totalprice = this.count_price(order_temp[i].products);
          order_temp[i].formatTime = this.formatTime(order_temp[i].payment.timeStamp);
        }
        this.setData({
          orders:order_temp,
        });
        if(this.data.orders.length==0)
          this.setData({
            is_order:false,
            is_stat:true,
          })
      }
    });
    
  },
  deng_lu:function(){
    var app = getApp();
    app.onLaunch();
    console.log("app()");
    this.onShow();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formatTime:function (timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds(); 
    //将上面的拼接到一块
    return Y+M+D+h+m+s;
  },
  count_price:function(list){
    var totalprice = 0;
    for(let i=0;i<list.length;i++)
    {
      totalprice+=list[i].count*list[i].productInfo.price;
    }
    return totalprice;
  },
})