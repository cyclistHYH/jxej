const app = getApp();

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    isEmpty: true,
    isChooseAll: false,
    totalPrice: 0,
    goods: [],
    isOpen: 1
  },

  // 选择全部
  chooseAll: function() {
    var that = this;
    var goods = that.data.goods;
    if (that.data.isChooseAll) {
      for (let i = 0; i < goods.length; i++) {
        goods[i].checked = false
      }
      that.setData({
        isChooseAll: false
      })
    } else {
      for (let i = 0; i < goods.length; i++) {
        goods[i].checked = true
      }
      that.setData({
        isChooseAll: true
      })
    }
    that.setData({
      goods: goods
    })
    that.toTotal()
  },

  // 选择商品
  goodsChoose: function(e) {
    var that = this;
    var idx = e.currentTarget.dataset.index;
    var goods = that.data.goods;
    var isChoose = true;
    goods[idx].checked = !goods[idx].checked
    that.setData({
      goods: goods
    })
    for (let i = 0; i < goods.length; i++) {
      if (!goods[i].checked) {
        isChoose = false
      }
    }
    if (!isChoose) {
      that.setData({
        isChooseAll: false
      })
    } else {
      that.setData({
        isChooseAll: true
      })
    }
    that.toTotal()
  },

  // 计算价格
  toTotal: function() {
    let that = this;
    let totalPrice = 0;
    let goods = that.data.goods;
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].checked) {
        var item = goods[i]
        totalPrice += parseFloat(item.product_price) * item.product_number;
      }
    }
    totalPrice = parseFloat(totalPrice.toFixed(2));
    that.setData({
      totalPrice: totalPrice
    })
  },

  // 减少数量
  numberLess: function(e) {
    let that = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let goods = that.data.goods;
    if (index !== "" && index != null) {
      if (goods[index].product_number > 1) {
        goods[index].product_number--;
      }
      that.setData({
        goods: goods
      })
    }
    my.request({
      url: app.globalData.baseUrl + '/cart/change-num.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cart_id: goods[index].id,
        num: goods[index].product_number
      },
      success: (res) => {

      },
    });
    that.toTotal()
  },

  // 增加数量
  numberPlus: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods = that.data.goods;
    if (index !== "" && index != null) {
      goods[index].product_number++;
      that.setData({
        goods: goods
      })
    }
    my.request({
      url: app.globalData.baseUrl + '/cart/change-num.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cart_id: goods[index].id,
        num: goods[index].product_number
      },
      success: (res) => {

      },
    });
    that.toTotal()
  },

  loadData() {
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;
    let that = this;
    my.showLoading({
      content: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/cart/list.html?token=' + token,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res)
        if (res.data.data.length > 0) {
          that.setData({
            goods: res.data.data,
            isEmpty: false
          })
        } else {
          that.setData({
            isEmpty: true
          })
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

  deleteBtn() {
    let that = this;
    var goods = that.data.goods;
    var id;
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].checked) {
        var item = goods[i]
        if (id == undefined) {
          id = item.id
        } else {
          id = id + "," + item.id
        }
      }
    }
    if (id == undefined) {
      my.alert({
        title: '提示',
        content: '请选择需要删除的商品',
      })
    } else {
      console.log(id)
      my.showLoading({
        title: "加载中..."
      });
      my.request({
        url: app.globalData.baseUrl + '/cart/delete-cart.html?token=' + my.getStorageSync({ key: 'token' }).data,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          cart_id: id
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 10000) {
            my.alert({
              title: '提示',
              content: '商品删除成功',
              success: () => {
                that.loadData();
              }
            });
          }
        },
        complete: () => {
          my.hideLoading();
        },
      });
    }
  },


  confirmBtn: function() {
    let that = this;
    let goods = that.data.goods;
    var product=[];
    var id;
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].checked) {
        var item = goods[i];
        var obj={
          img: item.thumbnail,
          name: item.product_name,
          buyQuantity: item.product_number,
          price: item.product_price,
          opt_text: item.opt_text,
          id: item.id
        }
        product.push(obj);
        if (id == undefined) {
          id = item.id
        } else {
          id = id + "," + item.id
        }
      }
    }
    if (id == undefined) {
      my.alert({
        title: '提示',
        content: '请选择需要购买的商品',
      })
    } else {
      var products= JSON.stringify(product)
      my.navigateTo({
        url: '/pages/buyConfirm/buyConfirm?goods=' + products +'&type=1'+'&cart_id=' +id
      });
    }
  },

  bindKeyInput(event){
    let goods = this.data.goods;
    let i = event.currentTarget.dataset.i;
    goods[i].product_number = event.detail.value;
    this.setData({
      goods: goods
    })
  },

  open:function(){
      my.request({
        method: "POST",
        url: app.globalData.baseUrl+'/login/check-open.html',
        headers: {"content-type":"application/x-www-form-urlencode"},
        success: (result) => {
          console.log(result)
          if(result.data.status == 10000){
            this.setData({
              isOpen: result.data.data.value
            })
          }
          console.log(this.data.isOpen)
        }
      });
  },
  onLoad() {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
		let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;

    if(token == null || token == "" || token == undefined){
      my.alert({
        title: '提示' ,
        content: "请先登录",
				success: () => {
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    } else {
			this.loadData();
			this.setData({
				isChooseAll: false,
				totalPrice: 0
			})
		}
		this.open();
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
