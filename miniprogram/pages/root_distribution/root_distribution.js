// pages/root_distribution/root_distribution.js
var db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    in_county_chao:0,
    in_county_fee:0,
    out_county_chao:0,
    out_county_fee:0,
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
    db.collection('distribution')
    .get({
      success:res=>{
        console.log(res);
        this.setData({
          in_county_chao:res.data[0].in_county_chao,
          in_county_fee:res.data[0].in_county_fee,
          out_county_chao:res.data[0].out_county_chao,
          out_county_fee:res.data[0].out_county_fee,
        })
      }
    })
  },
  onNumberChange1:function(e){
    this.data.in_county_chao = e.detail;
  },
  onNumberChange2:function(e){
    this.data.in_county_fee = e.detail;
  },
  onNumberChange3:function(e){
    this.data.out_county_chao = e.detail;
  },
  onNumberChange4:function(e){
    this.data.out_county_fee = e.detail;
  },
  update_distribution:function(){
    db.collection('distribution')
    .where({
      _id:"3bbc6ba865d8574000c7014755cfd891"
    })
    .update({
      data:{
        in_county_chao:this.data.in_county_chao,
        in_county_fee:this.data.in_county_fee,
        out_county_chao:this.data.out_county_chao,
        out_county_fee:this.data.out_county_fee,
      },
      success:res=>{
        wx.navigateBack({});
      },
      fail:res=>{
        wx.showToast({
          title: '网络不佳',
        })
      }
    })  
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