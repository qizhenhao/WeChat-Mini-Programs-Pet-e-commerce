// pages/order/order.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    db.collection('order')
    .where({
      order_numer:options.orderId,
    })
    .get({
      success:res=>{
        console.log(res);
        var test = res.data[0];
        test.totalprice = this.count_price(test.products);
        test.formatTime = this.formatTime(test.payment.timeStamp);
        console.log(test);
        this.setData({
          order:test,
        });
      }
    })
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
  Receive_goods:function(){
    wx.showModal({  
      title: '确认',  
      content: '您确定要执行此操作吗？',  
      success:res=> {  
        if (res.confirm) {  
          // 用户点击确定按钮  
          var time_str = new Date().getTime() ;
          var time = this.formatTime(time_str);
          this.data.order.complete.is_comp = true;
          this.data.order.complete.time_comp = time;
          db.collection('order')
          .where({
            _id:this.data.order._id,
          })
          .update({
            data:{
              complete:{
                is_comp:true,
                time_comp:time
              }
            },
            success:res=>{
              console.log(res);
            },
            fail:res=>{
              console.log(res);
            }
          })
          wx.navigateBack({});
        } else if (res.cancel) {  
          // 用户点击取消按钮  

        }  
      }  
    });  
  },
  detele_order:function(){
    wx.showModal({  
      title: '确认',  
      content: '您确定要删除订单吗？',  
      success:res=> {  
        if (res.confirm) {  
          // 用户点击确定按钮  
          db.collection('order')
          .where({
            _id:this.data.order._id,
          })
          .update({
            data:{
              complete:{
                is_detele:true,
              }
            },
            success:res=>{
              console.log(res);
            },
            fail:res=>{
              console.log(res);
            }
          })
          wx.navigateBack({});
        } else if (res.cancel) {  
          // 用户点击取消按钮  

        }  
      }  
    });  
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