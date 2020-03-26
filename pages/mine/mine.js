const app = getApp();

Page({
  data: {
    isLogin: false,
    avatar: '',
    nickName: '我是一串昵称',
    information: '再打卡15天可再摘得一颗星星哟',
    integral: 0,
    isQiandao: 0,
    delivery_staff: ""
  },
  undoneBtn: function() {
    // my.alert({
    //   title: '提示',
    //   content: '该功能正在开发中',
    //   buttonText: '我知道了'
    // });
  },

  toLogin: function() {
		 my.showLoading({
      content: '加载中...',
    });
		console.log("login")
		// this.toOut();
    let that = this;
    my.getOpenUserInfo({
      success: (res) => {
        var userInfo = JSON.parse(res.response).response;
        var nickName = userInfo.nickName;
        my.getAuthCode({
          scopes: 'auth_base',
          success: (res) => {
            my.request({
              url: app.globalData.baseUrl + '/login/info-auth.html',
              data: {
                code: res.authCode
              },
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {
                if (res.data.status == 10003) {
                  my.request({
                    url: app.globalData.baseUrl + '/login/login.html',
                    data: {
                      nikename: nickName,
                      ali_user_id: res.data.data.ali_user_id
                    },
                    method: 'POST',
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: (res) => {
                      if (res.data.status == 10000) {
                        my.showToast({
                          type: 'none',
                          content: '登录成功'
                        });
                        that.setData({
                          isLogin: true,
                          avatar: userInfo.avatar,
                          nickName: nickName
                        });
                        my.setStorageSync({
                          key: 'token',
                          data: res.data.data,
                        });
                        this.onShow();
                      } else if (res.data.status == 10002) {
                        my.showToast({
                          type: 'fail',
                          content: '操作失败',
                        });
                      }

                    },
                    complete: () => {
                      my.hideLoading();
                    }
                  });
                }
              },
            });
          },
        });
        my.setStorageSync({
          key: 'userInfo',
          data: JSON.parse(res.response).response,
        });
      }
    })
  },

  remind: function() {
    my.confirm({
      title: '提示',
      content: '该功能暂未开放。',
    })
  },

  toOut: function() {
    my.clearStorageSync();
    this.setData({
      isLogin: false,
      avatar: ''
    })
  },
  getWeekByDay: function(e) {
    return new Date(e).getDay();
  },
  redPoint: function() {
    let date = my.getStorageSync({ key: 'date', }).data;
    console.log(new Date().getDay() == new Date(date).getDay())
    if (new Date().getDay() == new Date(date).getDay()) {
      this.setData({
        isQiandao: 1
      })
    } else {
      this.setData({
        isQiandao: 0
      })
    }
  },
  onLoad() {
    // 页面加载
    if (my.canIUse('button.open-type.getAuthorize')) {
			
    } else {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
    }
  },

  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.redPoint();
    var token = my.getStorageSync({ key: 'token' }).data;
    if (token != '' && token != null && token != undefined) {
      this.setData({
        isLogin: true,
        nickName: my.getStorageSync({ key: 'userInfo' }).data.nickName,
        avatar: my.getStorageSync({ key: 'userInfo' }).data.avatar
      })
      my.request({
        method: "POST",
        url: app.globalData.baseUrl + '/shop-user/view.html?token=' + token,
        headers: { "content-type": "application/x-www-form-urlencoded" },
        success: (res) => {
          // this.redPoint();
          console.log(res.data)
          if (res.data.status == 10000) {
            this.setData({
              integral: res.data.data.integral,
              delivery_staff: res.data.data.delivery_staff
            })
            // this.onLoad();
          }
        },
      });
    } else {
      this.toOut();
      // my.alert({
      //   title: "提示",
      //   content: "请登录"
      // })
    }
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
