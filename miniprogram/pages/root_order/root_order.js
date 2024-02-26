// pages/root_order/root_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    searchText: '', // 用于存储搜索关键词的数据  
    orders:[],
    pageIndex: 1, // 当前页码  
    pageSize: 3, // 每页显示的数量 
    is_complete : false, 
    is_wei:true,
  },  
  navigateToOrderDetails:function(event){
    var orderId = event.currentTarget.dataset.orderid;  
    wx.navigateTo({  
      url: '/pages/root_order_xiang/root_order_xiang?orderId=' + orderId  
    }); 
  },
  onInput: function(e) {  
    this.setData({  
      searchText: e.detail.value // 更新搜索关键词的数据  
    });  
  },  
  onConfirm: function(e) {  
    // 在这里执行搜索操作，比如调用搜索API  
    wx.showLoading({
      duration:1200,
      title:'玩命加载中！',
    });
    if(this.data.searchText == '')
    {
      this.data.is_complete = false;
      this.data.pageIndex = 1;
      this.data.orders = [];
      this.queryOrders();
      return;
    }
    console.log('搜索关键词：', this.data.searchText);  
    wx.cloud.callFunction({
      name:'root_order_id',
      data:{
        order_id:this.data.searchText,
      },
      success:res=>{
        if(res.result.code===-1)
        {
          wx.showToast({
            title: '订单不存在',
            duration: 1000,
            icon:'error'
          });
        }
        else if(res.result.code===-2)
        {
          wx.showToast({
            title: '网络不稳定',
            duration: 1000,
            icon:'error'
          });
        }
        else
        {
          console.log(res.result.res);
          var test = res.result.res[0];
          test.formatTime = this.formatTime(test.payment.timeStamp);
          test.totalprice = this.count_price(test.products)
          wx.cloud.callFunction({
            name:'get_phone_number',
            data:{
              user_id:test.user_id,
            },
            success:ress=>{
              console.log(ress.result.code);
              if(ress.result.code===0)
              {
                test.phone = ress.result.res;
              }
              else if(ress.result.code===-1)
              {
                test.phone = "未找到此人";
              }
              this.setData({
                orders:res.result.res,
              })
            }
          })
        }
      },
      fail:res=>{
        console.log(res);
      }
    })
    // 清空输入框  
    // this.setData({  
    //   searchText: ''  
    // });  
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.queryOrders()
  },
 // 查询订单   
 queryOrders:function() {  
    if(this.data.is_complete===true)
      return;
    const res = wx.cloud.callFunction({  
      name: 'root_get_order', // 云函数名称  
      data: {  
        pageSize: this.data.pageSize,  
        pageIndex: this.data.pageIndex  
      },
      success:res=>{ 
        for(let i=0;i<res.result.data.length;i++)
        {
          var temp = res.result.data[i];
          temp.formatTime = this.formatTime(temp.payment.timeStamp);
          temp.totalprice = this.count_price(temp.products)
          this.data.orders.push(res.result.data[i]);
        }  
        if(res.result.data.length<this.data.pageSize)
        {
          this.data.is_complete = true;
        }
        this.data.pageIndex+=1;
        this.setData({
          orders:this.data.orders,
        })
      }     
    })  
},  
// 加载更多订单（点击下一页时调用）  
loadMore: function() {  
  this.queryOrders()  
},  

// 跳转到第一页（点击首页时调用）  
goToFirstPage: function() {  
  this.setData({  
    orders: [], // 清空当前数据  
    pageIndex: 1 // 重置页码为第一页  
  })  
  this.queryOrders()  
},  
shai_wei:function(){
  this.setData({
    is_wei:false,
  })
  wx.showLoading({
    duration:500,
    title:'玩命加载中！',
  });
},
shai_suo:function(){
  this.setData({
    is_wei:true,
  })
  wx.showLoading({
    duration:500,
    title:'玩命加载中！',
  });
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
    this.loadMore();
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

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