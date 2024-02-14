// pages/user_mod/user_mod.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    sexOptions:['男','女','保密'],
  },
  //改变头像
  OnchooseAvatar:function(e){
    console.log(e);
    console.log( this.data.userInfo);
    this.setData({
      'userInfo.userAvatarUrl':e.detail.avatarUrl,
    });
  },
  //改变名称
  nicknameInput:function(e){
    console.log(e);
    this.setData({
      'userInfo.userNickname':e.detail.value,
    });
  },
  //改变生日
  bindDateChange:function(e){
    this.setData({
      'userInfo.birthday':e.detail.value,
    });
  },
  //改变性别
  sexChange:function(e){
    console.log(e);
    this.setData({
      'userInfo.sex':e.detail.value,
    });
  },
  //获取电话
  getPhoneNumber:function(e){
    if( this.data.userInfo.userPhoneInfo != undefined){
      wx.showToast({
        title: '请勿重复获取手机号！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    console.log(e);
    let code = e.detail.code;
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        code:code,
      },
      success: res => {
        console.log(res);
        this.setData({
          'userInfo.userPhoneInfo': res.result.phoneInfo ,
        });
      }
    });
  },
  //保存
  submitForm:async function(){
    wx.cloud.callFunction({
      name: 'user_mod',
      data: {
        userInfo:this.data.userInfo
      },
      success: res => {
        console.log(res);
      }
    });
    wx.showToast({
      title: '编辑成功',
      image:'/images/zq.png',
    })
    await this.sleep(2000);
    wx.navigateBack()
  },
  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    this.setData({
      userInfo:app.globalData.userinfo,
    });

    console.log(this.data.userInfo.birthday);
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