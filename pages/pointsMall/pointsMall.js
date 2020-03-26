const app = getApp();
Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    mall: [
      // {
      //   img: '/images/productImg1.jpg',
      //   title: '凯速国潮风巨轮健腹轮',
      //   integralPrice: 299,
      //   stock: 11215,
      // },
    ],
  },
  showLoading() {
    my.showLoading({
      content: '加载中...',
    });
  },
  loadData: function(){
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
        method: "POST",
        url:app.globalData.baseUrl + '/product/pro-list.html?token='+ token,
        headers: {"content-type":"application/x-www-form-urlencoded"},
        data:{
          type: 2
        },
        success: (res) => {
          console.log(res.data.data,"pointsMall")
          if(res.data.status == 10000){
            this.setData({
              mall: res.data.data
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
        }
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
