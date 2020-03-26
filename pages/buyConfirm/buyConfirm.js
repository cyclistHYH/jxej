const app = getApp();

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    isNull: false,
    isJifen: "",
    address: {},
    goods: [
      {
        img: '/images/productImg1.jpg',
        title: '商品名商品名商品名商品名',
        label: '型号：1号',
        price: 199,
        quantity: 1,
      }
    ],
    leaveMessage: '',
    optional_id: '',
    product_id: '',
    activity_id: '',
    opt_text: '',
    opt_price: '',
    address_id: '',
    totalPrice: 0,
    freight: 0,
    type: '',aType: "",
    cart_id: '',
    pro_num: '',
    pinData: [],
    isCoupon: 0,coupon_id: "",
		coupon_money: 0,is_use: 0,express_type: 3,
		isCheck: false,checked: false,canfree: ""
  },

  leaveMessage: function(e) {
    this.setData({
      leaveMessage: e.detail.value
    })
  },

  loadAddress: function() {
    let that = this;
    my.showLoading({
      content: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/address/list.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      success: (res) => {
        if (res.data.status == 10000) {
          if (res.data.data.length > 0) {
            var address_id = that.data.address_id;
						console.log(address_id)
            if (address_id != null && address_id != "" && address_id != undefined) {
              that.updateAddress(address_id)
            } else {
              for (var i in res.data.data) {
                if (res.data.data[i].is_default == 1) {
                  that.setData({
                    address: res.data.data[i],
                    isNull: false
                  })
                } else{
									that.setData({
                    address: "",
                    isNull: true
                  })
								}
              }
            }
          } else {
            that.setData({
              isNull: true
            })
          }
        }
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  updateAddress(e) {
    let that = this;
    my.showLoading({
      title: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/address/view.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        address_id: e
      },
      success: (res) => {
        that.setData({
          address: res.data.data,
          isNull: false
        })
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  totalPrice: function() {
    let that = this;
    var goods = that.data.goods;
    var totalPrice = 0;
    for (var i = 0; i < goods.length; i++) {
      totalPrice = totalPrice + goods[i].price * goods[i].buyQuantity
    }
    totalPrice = ((Number(totalPrice) + Number(that.data.freight)).toFixed(2)*10 - this.data.coupon_money*10)/10;
    that.setData({
      totalPrice: totalPrice
    })
  },

  confirmBtn: function() {
		if(this.data.express_type == 1 && this.data.checked == false){
			console.log(this.data.checked)
			my.alert({
				title: '提示',
				content: "请选择配送方式" 
			});
		} else{
			let that = this;
			var token = my.getStorageSync({ key: 'token' }).data;
			let address_id;
			if (that.data.address_id == undefined || that.data.address_id == "") {
				address_id = that.data.address.address_id
				console.log(address_id)
			} else {
				address_id= that.data.address_id
			}
			if (address_id == undefined || address_id == "" || address_id == null) {
				my.confirm({
					content: "请选择您的收货地址",
					confirmButtonText: '马上添加',
					cancelButtonText: '暂不需要',
					success: (result) => {
						if(result.confirm){
							my.navigateTo({
								url: "/pages/address/address?type=0"
							})
						} 
					},
				});
			} else{
				if (that.data.type == 0) {
					my.showLoading({
						content: "加载中..."
					});
					my.request({
						method: 'POST',
						url: app.globalData.baseUrl + '/order/order-by-pro.html?token=' + token,
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							product_id: that.data.product_id,
							address_id: address_id,
							optional_id: that.data.optional_id,
							product_num: that.data.goods[0].buyQuantity,
							remarks: that.data.leaveMessage,
							coupon_id: that.data.coupon_id,
							express_type: that.data.express_type
						},
						success: (res) => {
							if (res.data.status == 10006) {
								my.alert({
									title: '提示',
									content: '暂无库存，请联系客服',
									success: () => {
										my.switchTab({
											url: '/pages/index/index'
										});
									}
								})
							}
							if (res.data.status == 10000) {
									var order_id = res.data.data;
									my.request({
										url: app.globalData.baseUrl + '/pay/pay.html?token=' + token,
										method: 'POST',
										headers: {
											'content-type': 'application/x-www-form-urlencoded'
										},
										data: {
											order_id: order_id
										},
										success: (res) => {
											my.tradePay({
												tradeNO: res.data.data, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
												success: (res) => {
													var resultCode = res.resultCode
													if (resultCode == 6001 || resultCode == 4000) {
														my.alert({
															title: '提示',
															content: '支付失败请重试',
															success: ()=>{
																my.navigateBack();
															}
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
																order_id: order_id
															},
															success: (res) => {
																my.redirectTo({
																	url: '/pages/buySuccess/buySuccess?order_id=' + order_id 
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
				} else if (that.data.type == 1) {//购物车
					my.showLoading({
						content: "加载中..."
					});
					my.request({
						url: app.globalData.baseUrl + '/order/order-by-cart.html?token=' + token,
						method: 'POST',
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							address_id: address_id,
							cart_id: that.data.cart_id,
							remarks: that.data.leaveMessage,
							coupon_id: this.data.coupon_id,
							express_type: that.data.express_type
						},
						success: (res) => {
							console.log(res)
							if (res.data.status == 10006) {
								my.alert({
									title: '提示',
									content: '暂无库存，请联系客服',
									success: () => {
										my.switchTab({
											url: '/pages/index/index'
										});
									}
								})
							}
							if (res.data.status == 10000) {
								var order_id = res.data.data;
								my.request({
									url: app.globalData.baseUrl + '/pay/pay.html?token=' + token,
									method: 'POST',
									headers: {
										'content-type': 'application/x-www-form-urlencoded'
									},
									data: {
										order_id: order_id
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
														content: '支付失败请重试',
														success: ()=>{
															my.navigateBack();
														}
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
															order_id: order_id
														},
														success: (res) => {
															console.log(res)
															my.redirectTo({
																url: '/pages/buySuccess/buySuccess?order_id=' + order_id
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
				} else if(this.data.type == 2){//秒杀
					my.showLoading({
						content: "加载中..."
					});
					my.request({
						method: "POST",
						url: app.globalData.baseUrl+'/activity/add.html?token='+token,
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data:{
							activity: this.data.activity_id,
							address: address_id,
							express_type: that.data.express_type
						},
						success: (res) => {
							console.log(res,"miaosha")
							if (res.data.status == 10000) {
								my.alert({
									title: "提示",
									content: res.data.message,
									success:() =>{
										my.showLoading({
											content: "加载中...",
										});
										setTimeout(function(){
											my.hideLoading();
											my.navigateTo({
												url:"/pages/order/order"
											})
										},3000)
									}
								});
							} else{
								my.alert({
									title: "提示",
									content: res.data.message 
								});
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
						complete:()=>{
							my.hideLoading();
						}
					});
				} else if(this.data.type == 3){//拼团
					my.showLoading({
						content: "加载中..."
					});
					my.request({
						method: "POST",
						url: app.globalData.baseUrl +'/activity/add.html?token='+ token,
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data:{
							activity: this.data.activity_id,
							address: address_id,
							pro_num: this.data.pro_num,
							express_type: that.data.express_type,
						},
						success: (res) => {
							console.log(res.data.data,"tuan")
							if (res.data.status == 10000) {
									var order_id = res.data.data;
									my.request({
										url: app.globalData.baseUrl + '/pay/pay.html?token=' + token,
										method: 'POST',
										headers: {
											'content-type': 'application/x-www-form-urlencoded'
										},
										data: {
											order_id: order_id
										},
										success: (res) => {
											my.tradePay({
												tradeNO: res.data.data, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
												success: (res) => {
													var resultCode = res.resultCode
													if (resultCode == 6001 || resultCode == 4000) {
														my.alert({
															title: '提示',
															content: '支付失败请重试',
															success: ()=>{
																my.navigateBack();
															}
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
																order_id: order_id
															},
															success: (res) => {
																my.redirectTo({
																	// url: '/pages/buySuccess/buySuccess?order_id=' + order_id
																	url: "/pages/groupDetails/groupDetails?order_id="+order_id+"&pinData="+this.data.pinData
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
							} else{
								my.alert({
									title: "提示",
									content: res.data.message 
								});
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
						complete:()=>{
							my.hideLoading();
						}
					});
				} else if(this.data.type == 4){
					my.showLoading({
						content: "加载中..."
					});
					my.request({
						method: 'POST',
						url: app.globalData.baseUrl + '/order/order-by-pro.html?token=' + token,
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							product_id: that.data.product_id,
							address_id: address_id,
							optional_id: that.data.optional_id,
							product_num: that.data.goods[0].buyQuantity,
							remarks: that.data.leaveMessage,
							express_type: that.data.express_type
						},
						success: (res) => {
							console.log(res.data,"ha")
							if (res.data.status == 10006) {
								my.alert({
									title: '提示',
									content: res.data.message,
								})
							}
							if(res.data.status == 10000){
								my.alert({
									title: '提示' ,
									content:"购买成功！",
									success: () => {
										my.switchTab({
											url: '/pages/index/index'
										});
									}
								});
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
						complete:()=>{
							my.hideLoading();
						}
					})

				}
			}
		}
  },

  toUse:function(e){
		my.navigateTo({
			url:"/pages/coupon/coupon?type="+e.currentTarget.dataset.type+"&price="+this.data.totalPrice
		});
		// if(this.data.coupon_id == ''){
		// 	my.navigateTo({
		// 		url:"/pages/coupon/coupon?type="+e.currentTarget.dataset.type+"&price="+this.data.totalPrice
		// 	});
		// } else{
		// 	my.alert({
		// 		title: '提示',
		// 		content: "已使用优惠券" 
		// 	});
		// }
  },

  onChange:function(e){
    this.setData({
      express_type: e.currentTarget.dataset.value,
			checked: true
    })
    console.log(this.data.express_type,e,"e")
		if(e.currentTarget.dataset.value == 2){
			this.canFree();
			this.totalPrice();
			if(this.data.totalPrice < this.data.canfree.errand_fee.value){
				this.setData({
					freight: this.data.canfree.errand_fee_price.value
				})
				this.totalPrice();
			}
		} else{
			this.setData({
				freight: 0
			})
			this.totalPrice();
		}
  },

	canFree:function (){
		my.request({
			method: "POST",
			url: app.globalData.baseUrl+'/product/errand-fee.html?token='+my.getStorageSync({
				key: 'token', // 缓存数据的key
			}).data,
			success: (res) => {
				console.log(res,"res")
				this.setData({
					canfree: res.data.data,
				})
			},
		});
	},

  onLoad(options) {
    console.log(options)
    if (options.type == 0) { //购买
      this.setData({
        optional_id: options.optional_id,
        product_id: options.product_id,
        goods: JSON.parse(options.goods),
        opt_text: options.opt_text,
        opt_price: options.opt_price,
        type: options.type,
        isCoupon: 1,
        express_type: JSON.parse(options.goods)[0].express_type
      })
			if(this.data.express_type == 1){
				this.setData({
					isCheck: true,
				})
			}
    } else if (options.type == 1) { //购物车
      this.setData({
        goods: JSON.parse(options.goods),
        cart_id: options.cart_id,
        type: options.type,
        isCoupon: 1
      })
       my.request({
        method: "POST",
        url: app.globalData.baseUrl +'/cart/express-type.html?token='+ my.getStorageSync({ key: 'token' }).data,
        headers: {"content-type": "application/x-www-form-urlencoded"},
        data:{
          cart_id: this.data.cart_id
        },
        success: (result) => {
          console.log(result,"re")
          if(result.data.status == 10000){
            let data = result.data.data;
            console.log(data,data.indexOf(1),"t")
            if(data.indexOf(1) != -1){
              console.log(1)
              this.setData({
                express_type: 1,
                isCheck: true,
              })
            } else{
              this.setData({
                express_type: 3,
              })
            }
          }
        }
      });
    } else if(options.type == 2){ //秒杀
      this.setData({
        goods: JSON.parse(options.goods),
        activity_id: options.activity_id,
        product_id: options.product_id,
        type: options.type,
				aType: 1,
        express_type: JSON.parse(options.goods).express_type
      })
			if(this.data.express_type == 1){
				this.setData({
					isCheck: true,
				})
			}
    } else if(options.type == 3){ //拼团
      this.setData({
        goods: JSON.parse(options.goods),
        activity_id: options.activity_id,
        product_id: options.product_id,
        type: options.type,
				aType: 1,
        pro_num: options.pro_num,
        pinData: options.pinData,
        express_type: JSON.parse(options.goods)[0].express_type
      })
			if(this.data.express_type == 1){
				this.setData({
					isCheck: true,
				})
			}
    } else if(options.type == 4){ //积分
      this.setData({
        optional_id: options.optional_id,
        product_id: options.product_id,
        goods: JSON.parse(options.goods),
        opt_text: options.opt_text,
        opt_price: options.opt_price,
        type: options.type,
        isJifen: options.isJifen,
        express_type: JSON.parse(options.goods)[0].express_type
      })
			if(this.data.express_type == 1){
				this.setData({
					isCheck: true
				})
			}
    }
    console.log(this.data.goods,"goods")
  },

  onShow() {
		this.canFree();
    this.loadAddress();
    this.totalPrice();
    if(this.data.coupon_id){
      this.setData({
        is_use: 1
      })
    }
  },
});
