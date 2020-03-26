const app=getApp()

Page({
  data: {
    orderId: '',
    pathHeader: app.globalData.baseUrl,
    order: '',
    courier: ''
  },

  loadData:function(){
			let that=this;
			my.request({
				url: app.globalData.baseUrl + '/order/view.html?token=' + my.getStorageSync({
					key: 'token', // 缓存数据的key
				}).data,
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					order_id: that.data.orderId
				},
				success: (res) => {
					console.log(res)
					if (res.data.status==10000) {
						that.setData({
							order: res.data.data,
							courier: JSON.stringify(res.data.data.courier)
						})
					}
				},
				complete: () => {
					my.hideLoading();
				},
			});
  },

  toCancel: function(e) {
    let that = this;
    my.showLoading({
      title: '取消中'
    });
    my.request({
      url: app.globalData.baseUrl + '/order/cancel.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: e.currentTarget.dataset.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          my.alert({
            title: '提示',
            content: res.data.message,
            success: () => {
              that.loadData()
            }
          });
        } else {
          my.alert({
            title: '提示',
            content: res.data.message
          });
        }
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  payBtn: function(e) {
    let that = this;
    var token = my.getStorageSync({ key: 'token' }).data;
    my.showLoading({
      title: '加载中'
    });
    my.request({
      url: app.globalData.baseUrl + '/pay/pay.html?token=' + token,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: e.currentTarget.dataset.id
      },
      success: (res) => {
        console.log(res)
        my.tradePay({
          tradeNO: res.data.data, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          success: (res) => {
            var resultCode = res.resultCode
            console.log(resultCode)
            if (resultCode == 6001 || resultCode == 4000) {
              my.alert({
                title: '提示',
                content: '支付失败请重试'
              })
            }
            if (resultCode == 6002) {
              my.alert({
                title: '提示',
                content: '网络出错请稍后重试'
              })
            }
            if (resultCode == 9000) {
              my.request({
                url: app.globalData.baseUrl + '/order/synchronous-callback.html?token=' + token,
                method: 'POST',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  order_id: e.currentTarget.dataset.id
                },
                success: (res) => {
                  console.log(res)
                  my.redirectTo({
                    url: '/pages/buySuccess/buySuccess?order_id=' + e.currentTarget.dataset.id
                  });
                },
              });
            }
          },
          fail: (res) => {
            my.alert({
              content: JSON.stringify(res),
            });
          }
        });
      },
    });
  },

  confirmBtn: function(e) {
    let that = this;
    my.showLoading({
      title: '确认中'
    });
    my.request({
      url: app.globalData.baseUrl + '/order/ordercompleted.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: e.currentTarget.dataset.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          my.alert({
            title: '提示',
            content: res.data.message,
            success: () => {
              that.loadData()
            }
          });
        } else {
          my.alert({
            title: '提示',
            content: res.data.message
          });
        }
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  express: function(){
    my.navigateTo({
      url:"/pages/express/express?courier="+this.data.courier
    })
  },

  onLoad(options) {
    this.setData({
      orderId: options.id
    })
    console.log(this.data.orderId)
  },
  onShow() {
    // 页面显示
    this.loadData()
  },
});
