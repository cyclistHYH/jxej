const app = getApp();
// var Wxparse = require('../../wxParse/wxParse.js');
import parse from 'mini-html-parser2';

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    id: '',
    album: [],
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
    isBuyNow: false,
    content: [],
  },

  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  toAddShop: function () {
    this.setData({
      isShow: true,
      isBuyNow: false
    })
  },

  toBuy: function () {
    this.setData({
      isShow: true,
      isBuyNow: true
    })
  },

  toClose: function () {
    this.setData({
      isShow: false
    })
  },

  numberLess: function () {
    let that = this;
    var number = that.data.buyQuantity;
    if (number > 1) {
      number--;
      that.setData({
        buyQuantity: number
      })
    }
  },

  numberPlus: function () {
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

  labelItemTap: function (e) {
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
  labelItemTap1: function (e) {
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

  loadData: function (e) {
    let that = this;
    var id = e;
    my.showLoading({
      content: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/product/pro-view.html',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        product_id: id
      },
      success: (res) => {
        console.log(res)
        // console.log(res.data.data.goods_optional)
        if (res.data.data.goods_optional.length > 0) {
          if (res.data.data.goods_optional.length == 1) {
            let id = String(res.data.data.goods_optional[0].id)
            if (id.indexOf(',') > -1) {
              res.data.data.goods_optional[0].opt_text = res.data.data.goods_optional[0].opt_text.split(",")
              res.data.data.goods_optional[0].id = res.data.data.goods_optional[0].id.split(",")
              // console.log(res.data.data.goods_optional[0].id)
              that.setData({
                skuId: res.data.data.goods_optional[0].id[0],
                opt_text: res.data.data.goods_optional[0].opt_text[0],
                opt_price: res.data.data.goods_optional[0].opt_price[0].opt_price,
                stock: res.data.data.goods_optional[0].opt_price[0].stock
              })
            } else {
              res.data.data.goods_optional[0].opt_text = Array.of(res.data.data.goods_optional[0].opt_text)
              // console.log(res.data.data.goods_optional[0].id)
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
            console.log(id, id1);
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
                console.log(res.data.data.goods_optional[0].id[0])
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
              res.data.data.goods_optional[0].id = res.data.data.goods_optional[0].id
              console.log(res.data.data.goods_optional[0].id)
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
        that.setData({
          album: res.data.data.album,
          goods: res.data.data,
        })
        let html = res.data.data.content;
        html = html.replace(/\<img/g, '<img style="width:750rpx;height:auto;display:block"');
        parse(html, (err, content) => {
          if (!err) {
            this.setData({
              content: content,
            });
          }
        })
        // Wxparse.wxParse('article', 'html', res.data.data.content, that, 0);
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  confirmBtn: function () {
    let that = this;
    let optional_id;
    let opt_text;

    var isBuyNow = that.data.isBuyNow;
    if (that.data.skuId1 == "") {
      optional_id = that.data.skuId;
      opt_text = that.data.opt_text
    } else {
      optional_id = that.data.skuId + "," + that.data.skuId1;
      opt_text = that.data.opt_text + that.data.opt_text1
    }
    let token = my.getStorageSync({ key: 'token' });
    if (isBuyNow) {
      if (token.data == null || token.data == "" || token.data == undefined) {
        my.alert({
          title: '提示',
          content: '请先登录',
          success: () => {
            my.switchTab({
              url: '/pages/mine/mine',
            });
          }
        });
      } else {
        var goods = [{}];
        goods[0].img = that.data.goods.thumbnail;
        goods[0].name = that.data.goods.product_name;
        goods[0].buyQuantity = that.data.buyQuantity;
        goods[0].price = that.data.opt_price;
        goods[0].opt_text = opt_text;
        goods[0].express_type = that.data.goods.express_type;
        var good = JSON.stringify(goods)
        my.navigateTo({
          url: '/pages/buyConfirm/buyConfirm?goods=' + good + '&type=0' + '&product_id=' + that.data.id + '&optional_id=' + optional_id + "&opt_text=" + opt_text + "&opt_price=" + that.data.opt_price
        });
      }
    } else {
      if (token.data == null || token.data == "" || token.data == undefined) {
        my.alert({
          title: '提示',
          content: '请先登录',
          success: () => {
            my.switchTab({
              url: '/pages/mine/mine',
            });
          }
        });
      } else {
        my.showLoading({
          title: "加载中..."
        });
        console.log(optional_id, "id")
        my.request({
          url: app.globalData.baseUrl + '/cart/add-cart.html?token=' + token.data,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            product_id: that.data.id,
            product_num: that.data.buyQuantity,
            optional_id: optional_id,
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
              my.alert({
                title: '提示',
                content: res.data.message,
                success: () => {
                  that.setData({
                    isShow: false
                  })
                }
              });
            }
          },
          fail: () => {
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
        })
      }
    }
  },
  bindKeyInput(event) {
    console.log(event.detail.value, 23)
    this.setData({
      buyQuantity: event.detail.value
    })
  },
  onLoad(options) {
    var id = null;
    if (options.id) {
      id = options.id;
    }
    else {
      var query = my.getStorageSync({
        key: "query"
      }).data;
      id = query.id;
    }
    if (!id) {
      my.navigateTo({
        url: "/pages/index/index"
      })
    }
    this.loadData(id);
    this.setData({
      id: options.id,
    })
  },
  onShow() {

  }

});
