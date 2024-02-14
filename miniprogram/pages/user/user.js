//密钥            a272a559f1fe265d2ce81e3940373d70
// miniprogram/pages/user/user.js
//引用用户等级与等级特权表的数据库访问类
import LevelService from '../../data_service/LevelService.js'
var levelService = new LevelService();
//引用用户信息的数据库访问类
import UserService from '../../data_service/UserService.js'
var userService = new UserService();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {}, //用户信息
    root:false,
  },
  //跳转到修改个人信息
  modify_user(){
    wx.navigateTo({
      url: '../user_mod/user_mod',
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
    this.setData({
      userinfo : app.globalData.userinfo,
    });
    wx.cloud.callFunction({
      name: 'check_root',
      data: {},
      success: res => {
        console.log(res);
        this.setData({
          root:res.result,
        })
      }
    });
    console.log(this.data.root);
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

  }
})