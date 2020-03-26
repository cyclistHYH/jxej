const app = getApp();
import parse from 'mini-html-parser2';

Page({
  data: {
    album: "",
    pathHeader: app.globalData.baseUrl,
    id: '',
    current: '',
    goods: [],
    buyQuantity: 1,
    currentLabel: 0,
    currentLabel1: 0,
    isShow: false,
    opt_price: "",
    skuId: "",
    skuId1: "",
    opt_text: "",
    opt_text1: '',
    stock: "",
  },
  showLoading() {
    my.showLoading({
      content: '加载中...',
    });
    setTimeout(() => {
      my.hideLoading();
      this.loadData();
    }, 1000);
  },
  loadData: function(id){
    let that = this;
    my.request({
      method: "POST",
      url:app.globalData.baseUrl + '/product/pro-view.html?token='+my.getStorageSync({
        key: 'token', // 缓存数据的key
      }).data,
      headers: {"content-type":"application/x-www-form-urlencoded"},
      data:{
        product_id: id
      },
      success: (res) => {
        console.log(res.data,"pointsMall")
        if(res.data.status == 10000){

          if (res.data.data.goods_optional.length > 0) {
            if (res.data.data.goods_optional.length == 1) {
              let id = String(res.data.data.goods_optional[0].id)
              if (id.indexOf(',') > -1) {
                res.data.data.goods_optional[0].opt_text = res.data.data.goods_optional[0].opt_text.split(",")
                res.data.data.goods_optional[0].id = res.data.data.goods_optional[0].id.split(",")
                that.setData({
                  skuId: res.data.data.goods_optional[0].id[0],
                  opt_text: res.data.data.goods_optional[0].opt_text[0],
                  opt_price: res.data.data.goods_optional[0].opt_price[0].opt_price,
                  stock: res.data.data.goods_optional[0].opt_price[0].stock
                })
              } else {
                res.data.data.goods_optional[0].opt_text = Array.of(res.data.data.goods_optional[0].opt_text)
                that.setData({
                  skuId: res.data.data.goods_optional[0].id,
                  opt_text: res.data.data.goods_optional[0].opt_text,
                  opt_price: res.data.data.goods_optional[0].opt_price[0].opt_price,
                  stock: res.data.data.goods_optional[0].opt_price[0].stock
                })
              }

            } if (res.data.data.goods_optional.length == 2) {
              console.log(res.data.data.goods_optional)
              let id = String(res.data.data.goods_optional[0].id)
              let id1 = String(res.data.data.goods_optional[1].id)
              if (id.indexOf(',') > -1) {
                res.data.data.goods_optional[0].opt_text = res.data.data.goods_optional[0].opt_text.split(",")
                res.data.data.goods_optional[0].id = res.data.data.goods_optional[0].id.split(",")
                if (id1.indexOf(',') > -1) {
                  res.data.data.goods_optional[1].opt_text = res.data.data.goods_optional[1].opt_text.split(",")
                  res.data.data.goods_optional[1].id = res.data.data.goods_optional[1].id.split(",")
                  that.setData({
                    skuId: res.data.data.goods_optional[0].id[0],
                    opt_text: res.data.data.goods_optional[0].opt_text[0],
                    opt_text1: res.data.data.goods_optional[1].opt_text[0],
                    skuId1: res.data.data.goods_optional[1].id[0],
                    opt_price: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].opt_price,
                    stock: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].stock
                  })
                } else {
                  res.data.data.goods_optional[1].opt_text = Array.of(String(res.data.data.goods_optional[1].opt_text))
                  res.data.data.goods_optional[1].id = Array.of(String(res.data.data.goods_optional[1].id))
                  that.setData({
                    skuId: res.data.data.goods_optional[0].id[0],
                    opt_text: res.data.data.goods_optional[0].opt_text[0],
                    // opt_text: res.data.data.goods_optional[1].opt_text[0],
                    skuId1: res.data.data.goods_optional[1].id[0],
                    opt_text1: res.data.data.goods_optional[1].opt_text[0],
                    opt_price: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].opt_price,
                    stock: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].stock
                  })
                }

              }
              else {
                res.data.data.goods_optional[0].opt_text = Array.of(res.data.data.goods_optional[0].opt_text)
                res.data.data.goods_optional[0].id = Array.of(res.data.data.goods_optional[0].id)

                if (id1.indexOf(',') > -1) {
                  res.data.data.goods_optional[1].opt_text = res.data.data.goods_optional[1].opt_text.split(",")
                  res.data.data.goods_optional[1].id = res.data.data.goods_optional[1].id.split(",")
                  that.setData({
                    skuId: res.data.data.goods_optional[0].id,
                    opt_text: res.data.data.goods_optional[0].opt_text,
                    skuId1: res.data.data.goods_optional[1].id[0],
                    opt_text1: res.data.data.goods_optional[1].opt_text[0],
                    opt_price: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].opt_price,
                    stock: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].stock
                  })
                } else {
                  res.data.data.goods_optional[1].opt_text = Array.of(String(res.data.data.goods_optional[1].opt_text))
                  res.data.data.goods_optional[1].id = Array.of(String(res.data.data.goods_optional[1].id))
                  that.setData({
                    skuId: res.data.data.goods_optional[0].id,
                    opt_text: res.data.data.goods_optional[0].opt_text,
                    opt_text1: res.data.data.goods_optional[1].opt_text,
                    skuId1: res.data.data.goods_optional[1].id[0],
                    opt_price: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].opt_price,
                    stock: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].stock
                  })
                }
              }
            }
          }

          this.setData({
            goods: res.data.data,
            album: res.data.data.album,
            price: res.data.data.integral,
            product_name: res.data.data.product_name,
            id: res.data.data.id
          })
          let html = res.data.data.content;
					html = html.replace(/\<img/g,'<img style="width:750rpx;height:auto;display:block"');
					parse(html, (err, content) => {
	　　　　　　if (!err) {
	　　　　　　　　this.setData({
									content: content,
	　　　　　　　　});
	　　　　　　}
          })
        }
      },
    });
  },

  fastExchange: function(){
    this.setData({
      isShow: true
    })
  },

  toClose: function() {
    this.setData({
      isShow: false
    })
  },

  numberLess: function() {
    let that = this;
    var number = that.data.buyQuantity;
    if (number > 1) {
      number--;
      that.setData({
        buyQuantity: number
      })
    }
  },

  numberPlus: function() {
    let that = this;
    var number = that.data.buyQuantity;
    var stock = that.data.stock;
    if (number >= stock) {

    } else {
      number++;
      that.setData({
        buyQuantity: number
      })
    }
  },

    labelItemTap: function(e) {
    console.log(e.currentTarget.dataset.index)
    var that = this
    if (that.data.goods.goods_optional.length == 1) {
      if (that.data.goods.goods_optional[0].id.length > 1) {
        that.setData({
          skuId: that.data.goods.goods_optional[0].id[e.currentTarget.dataset.index],
          opt_text: that.data.goods.goods_optional[0].opt_text[e.currentTarget.dataset.index],
          currentLabel: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index].opt_price,
          // opt_price2: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index].opt_price2,
          stock: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index].stock
        })
      } else {
        that.setData({
          skuId: that.data.goods.goods_optional[0].id,
          opt_text: that.data.goods.goods_optional[0].opt_text,
          currentLabel: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[0].opt_price,
          stock: that.data.goods.goods_optional[0].opt_price[0].stock,
          // opt_price2: that.data.goods.goods_optional[0].opt_price[0].opt_price2
        })
      }
    } if (that.data.goods.goods_optional.length == 2) {
      if (that.data.goods.goods_optional[0].id.length > 1) {
        that.setData({
          skuId: that.data.goods.goods_optional[0].id[e.currentTarget.dataset.index],
          opt_text: that.data.goods.goods_optional[0].opt_text[e.currentTarget.dataset.index],
          currentLabel: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index][that.data.goods.goods_optional[1].id[that.data.currentLabel1]].opt_price,
          // opt_price2: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price2,
          stock: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index][that.data.goods.goods_optional[1].id[that.data.currentLabel1]].stock,
        })
      } else {
        that.setData({
          skuId: that.data.goods.goods_optional[0].id,
          opt_text: that.data.goods.goods_optional[0].opt_text,
          currentLabel: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price,
          stock: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].stock,
          // opt_price2: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price2
        })
      }
    }
  },

  labelItemTap1: function(e) {
    var that = this
    if (that.data.goods.goods_optional[1].id.length > 1) {
      console.log(3)
      that.setData({
        skuId1: that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index],
        opt_text1: that.data.goods.goods_optional[1].opt_text[e.currentTarget.dataset.index],
        currentLabel1: e.currentTarget.dataset.index,
        opt_price: that.data.goods.goods_optional[0].opt_price[that.data.currentLabel][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price,
        // opt_price2: that.data.detailData.goods_optional[0].opt_price[that.data.ifShow][that.data.detailData.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price2,
        // stock: that.data.detailData.goods_optional[0].opt_price[that.data.ifShow][that.data.detailData.goods_optional[1].id[e.currentTarget.dataset.index]].stock
      })
    } else {
      that.setData({
        skuId1: that.data.goods.goods_optional[1].id[0],
        opt_text1: that.data.goods.goods_optional[1].opt_text[0],
        currentLabel1: e.currentTarget.dataset.index,
        opt_price: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price,
        // stock: that.data.detailData.goods_optional[0].opt_price[0][that.data.detailData.goods_optional[1].id].stock
        // opt_price2: that.data.detailData.goods_optional[0].opt_price[0][that.data.detailData.goods_optional[1].id].opt_price2
      })
    }
  },

  confirmBtn: function(){
    let that = this;
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    });
    let optional_id;
    let opt_text;
    if (that.data.skuId1 == "") {
      optional_id = that.data.skuId;
      opt_text = that.data.opt_text
    } else {
      optional_id = that.data.skuId + "," + that.data.skuId1;
      opt_text = that.data.opt_text + that.data.opt_text1
    }

    if(token.data == null || token.data == "" || token.data == undefined){
      my.alert({
        title: '提示' ,
        content: "请先登录",
        success: () =>{
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    } else{
      var goods = [{}];
        goods[0].img = that.data.goods.thumbnail;
        goods[0].name = that.data.goods.product_name;
        goods[0].buyQuantity = that.data.buyQuantity;
        goods[0].price = that.data.opt_price;
        goods[0].opt_text= opt_text;
        goods[0].isJifen = true;
        goods[0].express_type = that.data.goods.express_type
        var good = JSON.stringify(goods)
        my.navigateTo({
          url: '/pages/buyConfirm/buyConfirm?goods=' + good + '&type=4' + '&product_id=' + that.data.id + '&optional_id=' + optional_id + "&opt_text=" + opt_text + "&opt_price=" + that.data.opt_price
        });
    }
  },

  onLoad(option) {
    this.loadData(option.id);
  },
});
