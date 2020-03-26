const app = getApp();
// var wxParse = require("../../wxParse/wxParse")
import parse from 'mini-html-parser2';

Page({
  data: {
    isShow: false,
    pathHeader: app.globalData.baseUrl,
    goods: [],
    album: [],
    activity_price: "",
    original_price: "",
    product_name: "",
    buyQuantity: 1,
    content: "",
    type: 3,
  },
  onLoad(option) {
    console.log(option.id,"id")
    
    this.loadData(option.id);
  },
  onReady(){
    this.showLoading();
  },
  showLoading(){
    my.showLoading({
      content: "加载中...",
    });

    setTimeout(() => {
      my.hideLoading();
    },500)
  },

  loadData: function(id){
    my.showLoading({
      content: "加载中..."
    });
    let that = this;
    my.request({
      method: "POST",
      url: app.globalData.baseUrl+'/activity/view.html?token='+my.getStorageSync({
        key: 'token', // 缓存数据的key
      }).data,
      headers:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data:{
        activity_id: id
      },
      success: (res) => {
        console.log(res.data)
        if(res.status == 200){
          this.setData({
            goods: res.data.data,
            album: res.data.data.album,
            activity_price: res.data.data.activity_price,
            original_price: res.data.data.original_price,
            product_name: res.data.data.product_name,
            id: res.data.data.id,
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
        // wxParse.wxParse('article',"html",res.data.data.content,that,0)
      },
      complete:()=>{
        my.hideLoading();
      }
    });
  },

  confirmBtn: function(){
    let that = this;
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    });

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
      let goods=[{}];
      goods[0].img = that.data.goods.thumbnail;
      goods[0].name = that.data.goods.product_name;
      goods[0].buyQuantity = that.data.buyQuantity;
      goods[0].price = that.data.activity_price;
      goods[0].express_type = that.data.goods.express_type;
      goods = JSON.stringify(goods)
      my.navigateTo({
        url: "/pages/buyConfirm/buyConfirm?goods="+ goods +"&type=3"+"&activity_id="+ that.data.goods.id +"&pro_num="+ that.data.buyQuantity+"&pinData="+JSON.stringify(this.data.goods),
      });
    }
  },
  
  toClose: function() {
    this.setData({
      isShow: false
    })
  },

  groupBuy: function(){
    this.setData({
      isShow: true
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

  bindKeyInput(event){
    console.log(event.detail.value,23)
    this.setData({
      buyQuantity: event.detail.value
    })
  },
});
