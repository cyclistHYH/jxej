const app = getApp();
// var Wxparse = require('../../wxParse/wxParse.js');
import parse from 'mini-html-parser2';

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    goods: [],
    album: [],
    activity_price: "",
    original_price: "",
    product_name: "",
    buyQuantity: 1,
    content: "",
    type: 2,
    date: {},
    isOver: 1,
    start_date: "",
    end_date: "",
    people_num: 1
  },
  loadData: function(id) {
    my.showLoading({
      content: "加载中...",
    });
    let that = this;
    my.request({
      method: "POST",
      url: app.globalData.baseUrl + '/activity/view.html?token=' + my.getStorageSync({
        key: 'token', // 缓存数据的key
      }).data,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        activity_id: id
      },
      success: (res) => {
        console.log(res.data)
        if (res.status == 200) {
          this.setData({
            goods: res.data.data,
            album: res.data.data.album,
            activity_price: res.data.data.activity_price,
            original_price: res.data.data.original_price,
            product_name: res.data.data.product_name,
            id: res.data.data.id,
            content: res.data.data.content,
            isOver: -1,
            start_date: res.data.data.start_date,
            end_date: res.data.data.end_date,
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
          if(res.data.data.people_num == 0){
            this.setData({
              isOver: 2
            })
          }
          this.timer();
        }
        // Wxparse.wxParse('article', 'html', res.data.data.content, that, 0);
      },
      complete: () => {
        my.hideLoading();
      }
    });
  },
  timer: function() {
    var that = this;
    var startTime = new Date(this.data.start_date.replace("-", "/").replace("-", "/")).getTime();
    var endTime = new Date(this.data.end_date.replace("-", "/").replace("-", "/")).getTime();
    setInterval(() => {
      var now = new Date();
      if (startTime > now) {
        let ts = new Date(startTime) - now;
        let result = {};
        result.hh = that.checkTime(Math.floor(ts / 1000 / 3600));     // 计算剩余小时
        result.mm = that.checkTime(Math.floor(ts / 1000 / 60 % 60)); // 计算剩余分钟
        result.ss = that.checkTime(Math.floor((ts / 1000) % 60));  // 秒数
        this.setData({
          date: result,
          isOver: -1
        })
      } else {
        let ts = new Date(endTime) - now;
        if (ts <= 0) {
          this.setData({
            isOver: 1
          })
        } else {
          let result = {};
          result.hh = that.checkTime(Math.floor(ts / 1000 / 3600));     // 计算剩余小时
          result.mm = that.checkTime(Math.floor(ts / 1000 / 60 % 60)); // 计算剩余分钟
          result.ss = that.checkTime(Math.floor((ts / 1000) % 60));  // 秒数
          
          if(this.data.isOver == 2){
            this.setData({
              date: result,
              isOver: 2
            })
          } else {
            this.setData({
              date: result,
              isOver: 0
            })
          }
        }
      }
    }, 1000)
  },
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  fastBuy: function() {
    let that = this;
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    });

    if (token.data == null || token.data == "" || token.data == undefined) {
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
      let goods = [{}];
      goods[0].img = that.data.goods.thumbnail;
      goods[0].name = that.data.goods.product_name;
      goods[0].buyQuantity = that.data.buyQuantity;
      goods[0].price = that.data.activity_price;
      goods[0].express_type = that.data.goods.express_type;
      goods = JSON.stringify(goods);
      my.navigateTo({
        url: "/pages/buyConfirm/buyConfirm?goods=" + goods + "&type=2" + "&activity_id=" + that.data.goods.id,
      });
    }
  },
  activeOver: function() {
    if(this.data.isOver == 1){
      my.alert({
        title: '提示',
        content: "您来晚了！活动已结束"
      });
    } else if(this.data.isOver == 2){
      my.alert({
        title: '提示',
        content: "您来晚了！商品已售罄"
      });
    }
   
  },
  onLoad(option) {
    this.loadData(option.id);
    console.log(this.data)
  },
  onReady() {

  },
});
