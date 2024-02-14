//app.js
App({
  globalData:{
    openid:null,//用户的身份标识
    isLocked:false,//用户积分获取锁定标志
    userinfo:{}
  },
  onLaunch: function () {
    wx.cloud.init({
      env : "cloud1-0g0nhwzx2c9a40b4",
      traceUser: true,
    })
    
    //调用云函数获取用户openid，用户锁定标志，如用户未注册将自动注册
    wx.login({
      success: (res) => {
        let code_ = res.code;
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            this.globalData.userinfo = res.result;
          }
          
        })
      },
    })
    
  },
  
})
