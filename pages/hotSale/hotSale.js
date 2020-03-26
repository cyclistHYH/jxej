const app = getApp();

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    goods: [
      {
        // img: '/images/productImg1.jpg',
        // title: '凯速国潮风巨轮健腹轮',
        // txt: '商品介绍商品介绍商品介绍商品介绍商品介绍商品介绍商品介绍',
        // price: '99.00',
        // sale: 1215,
      }
    ],
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
  loadData: function() {
    let that = this;
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;

    if(token == null || token == "" || token == undefined){
      my.alert({
        title: '提示' ,
        content: "请先登录",
        success: () =>{
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    }else{
        my.request({
        url: app.globalData.baseUrl + '/product/hot.html',
        method: 'POST',
        headers:{"content-type":"application/x-www-form-urlencoded"},
        success: (res) => {
          if (res.data.status == 10000) {
            that.setData({
              goods: res.data.data
            })
          }
        },
      });
    }
  },

  onLoad() {
    this.loadData();
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
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
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
