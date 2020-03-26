const app = getApp();

Page({
  data: {
    isRemind: false,
    pathHeader: app.globalData.baseUrl,
    isNull: false,
    nav: ['全部', '已完成', '待发货', '待收货', '待付款'],
    activeNav: 0,
    activeStatus: 0,
    page: 1,
    pageSize: 10,
    load: true,
    order: [
      // {
      //   number: 111111111111,
      //   status: '待付款',
      //   goods: [
      //     {
      //       img: '/images/productImg1.jpg',
      //       title: '商品名商品名商品名商品名',
      //       label: '型号：1号',
      //       price: 199,
      //       quantity: 1,
      //     }
      //   ],
      //   quantity: 1,
      //   totalPrice: 199,
      // }
    ],
    remindTxt: '',
  },

  navClick: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    var status;
    switch (index) {
      case 0:
        status = 0;
        break;
      case 1:
        status = 5;
        break;
      case 2:
        status = 2;
        break;
      case 3:
        status = 3;
        break;
      case 4:
        status = 1;
        break;
    }
    that.setData({
      activeNav: e.currentTarget.dataset.index,
      activeStatus: status,
      page: 1,
      pageSize: 10,
    })
    that.loadData()
  },

  remind(e) {
    let that = this;
    that.setData({
      isRemind: true,
      remindTxt: e
    })
    setTimeout(() => {
      that.setData({
        isRemind: false
      })
    }, 2000);
  },

  loadData: function() {
		my.showLoading({
      content: '加载中...',
    });
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;

    
			let that = this;
			my.showLoading({
				content: '加载中'
			});
			var status = that.data.activeStatus;
			if (status == 0) {
				status = ''
			}
			my.request({
				url: app.globalData.baseUrl + '/order/list.html?token=' + my.getStorageSync({ key: 'token' }).data,
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					order_status: status,
					pagenumber: 1,
					numberperpage: 10
				},
				success: (res) => {
					console.log(res)
					if (res.data.status == 10000) {
						if (res.data.data.list.length > 0) {
							that.setData({
								order: res.data.data.list
							})
						} else if (res.data.data.list.length == 0) {
							that.remind('暂无数据');
							that.setData({
								order: []
							})
						}
					}
				},
        fail: ()=>{
          my.alert({
            content: "请重新登录",
            success: () => {
              my.switchTab({
                url: '/pages/mine/mine',
              });
            }
          });
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
      content: '加载中'
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
      success: (res)=> {
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
      complete: () =>{
        my.hideLoading();
      }
    });
  },

  confirmBtn: function(e) {
    let that = this;
    my.showLoading({
      content: '确认中'
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

	// express: function(){
  //   my.navigateTo({
  //     url:"/pages/express/express?courier="+this.data.courier
  //   })
  // },

  onLoad() { 
    this.loadData();
  },

  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
		let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;

    if (token == null || token == "" || token == undefined) {
      my.alert({
        title: '提示',
        content: "请先登录",
        success: () => {
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    } else {
    	this.loadData()
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

  // 分页
  pageData: function() {
    var that = this
    let token = my.getStorageSync({ key: 'token' });
    let numberperpage = that.data.pageSize
    let pagenumber = that.data.page
    var status = that.data.activeStatus;
    if (status == 0) {
      status = ''
    }
    my.showLoading({
      title: '加载中',
    });
    my.request({
      url: app.globalData.baseUrl + '/order/list.html?token=' + token.data,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        numberperpage: numberperpage,
        pagenumber: pagenumber,
        order_status: status
      },
      method: 'post',
      success: function(res) {
        if (res.data.data.list.length > 0) {
          that.setData({
            order: that.data.order.concat(res.data.data.list)
          })
        } else {
          that.remind('暂无更多数据')
          that.setData({
            load: false
          })
        }

      },
      complete: function() {
        my.hideLoading();
      }
    })
  },

  onReachBottom() {
    // 页面被拉到底部
    var that = this;
    var page = that.data.page
    that.setData({
      page: ++page
    });
    if (that.data.load == true) {
      that.pageData()
    } else {
      that.remind('暂无更多数据')
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
