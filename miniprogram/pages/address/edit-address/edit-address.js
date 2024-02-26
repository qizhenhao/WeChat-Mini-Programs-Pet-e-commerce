// miniprogram/pages/address/edit-address/edit-address.js
const util = require('../../../util/dateFormat.js')
import UserService from '../../../data_service/UserService.js'
var userService = new UserService();
import RegionService from '../../../data_service/RegionService.js'
var regionService = new RegionService();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    is_xian:false,
    defaultAddress:-1,
    AddressIndex: -1, //默认地址
    userAddressList: [], //用户地址列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad",options.id);
    this.setData({
      AddressIndex:options.id,
      address:app.globalData.userinfo.address,
    });
    if(this.data.AddressIndex!=-1)
    {
      this.setData({
        is_xian:this.data.address.userAddressList[this.data.AddressIndex].is_xian,
      })
    }
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

  // 如果有传过来的id参数，初始化页面
  initPage: function() {
    // 根据id获得目标地址
    var that = this;
    userService.getUsertAddressById(that.data.id,
      function(res) {
        console.log(res);
        that.setData({
          showDelete: true,
          address: res.address,
          isDefault: res.default,
          phone: res.phone,
          receiver: res.receiver,
          region: res.region,
          showRegion: res.region[0].name + ',' + res.region[1].name + ',' + res.region[2].name,
          chosenRegion: res.region[1].code
        })
      })
  },

  // 地区控件
  showPopup: function() {
    this.setData({
      show: true
    });
  },

  // 关闭地区控件(遮罩层)
  onClose: function(e) {
    this.setData({
      show: false
    });
  },

  //地区取消事件(组件)
  onRegionCancel: function(e) {
    this.setData({
      show: false
    });
  },

  // 地区选择确认事件
  onRegionComgirm: function(e) {
    var region = e.detail.values;
    this.setData({
      show: false,
      region: region,
      showRegion: region[0].name + ',' + region[1].name + ',' + region[2].name,
      chosenRegion: region[1].code
    });
  },
  onDefaultChange_xian_in:function(){
    if(this.data.is_xian){
      this.setData({
        is_xian:false,
      });
    }
    else{
      this.setData({
        is_xian:true,
      });
    }
    console.log(this.data.address);
  },
  //设置默认地址
  onDefaultChange: function() {
    if(this.data.AddressIndex!=this.data.address.defaultAddress){
      this.setData({
        "address.defaultAddress":this.data.AddressIndex,
      });
    }
    else{
      this.setData({
        "address.defaultAddress":-1,
      });
    }
    console.log(this.data.address);
  },

  // 点击删除按钮：删除这个地址
  onDeleteClick: async function() {
    if(this.data.AddressIndex<this.data.address.defaultAddress)
    {
      this.setData({
        'address.defaultAddress':this.data.address.defaultAddress-1,
      });
    }
    else if(this.data.AddressIndex==this.data.address.defaultAddress)
    {
      this.setData({
        'address.defaultAddress':-1,
      });
    }
    this.data.address.userAddressList.splice(this.data.AddressIndex,1);
    wx.cloud.callFunction({
      name: 'updateUserAddress',
      data: {
        Address:this.data.address,
      },
      success: res => {
        console.log("删除成功");
      }
    });
    wx.showToast({
      title: '删除成功',
      image:'/images/zq.png',
    })
    await this.sleep(2000);
    wx.navigateBack()
  },

  // 点击保存按钮：保存这次编辑
  onSaveClick: async function(e) {
    var formValue = e.detail.value;
    console.log("formValue",formValue);
    if(formValue.receiver==null){
        wx.showToast({
        title: '请输入姓名',
        duration: 2000,  
        image:'/images/cw.png',
        });
      return -1;
    } else if(formValue.phone==null){
      wx.showToast({
      title: '请输入电话号码',
      duration: 2000,  
      image:'/images/cw.png',
      });
    return -1;
    }
    else if(formValue.Region==null){
      wx.showToast({
      title: '请输入地址',
      duration: 2000,  
      image:'/images/cw.png',
      });
    return -1;
    }
    else if(formValue.address==null){
      wx.showToast({
      title: '请输入详细地址',
      duration: 2000,  
      image:'/images/cw.png',
      });
      return -1;
    }

    if(this.data.AddressIndex==-1)
    {
      this.data.address.userAddressList.push({
        receiver:formValue.receiver,
        phone:formValue.phone,
        Region:formValue.Region,
        address:formValue.address,
        is_xian:formValue.default_is_xian,
      });
    }
    if(this.data.AddressIndex!=-1){
      var temp = this.data.address.userAddressList[this.data.AddressIndex];
      temp.receiver=formValue.receiver;
      temp.phone=formValue.phone;
      temp.Region=formValue.Region;
      temp.address=formValue.address;
      temp.is_xian=formValue.default_is_xian;
    }

    if(formValue.default)
    {
      if(this.data.AddressIndex==-1)
        this.setData({
          'address.defaultAddress' : this.data.address.userAddressList.length-1,
        });
    }
    wx.cloud.callFunction({
      name: 'updateUserAddress',
      data: {
        Address:this.data.address,
      },
      success: res => {
        console.log("修改成功");
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
  }
})