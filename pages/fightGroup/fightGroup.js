const app = getApp();

Page({
  data: {
     goods: [
      // {
      //   img: '/images/productImg1.jpg',
      //   title: '凯速国潮风巨轮健腹轮',
      //   currentPrice: 99.00,
      //   originalPrice: 199.00,
      // }
    ],
    pathHeader: app.globalData.baseUrl,
    isShow: true,
  },
  loadData: function(){
    my.showLoading({
      content: "加载中..."
    });
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
        url: app.globalData.baseUrl+'/activity/list.html?token=' + my.getStorageSync({
          key: 'token', // 缓存数据的key
        }).data,
        data: {
          type: 1 
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          let data = res.data.data;
          this.setData({
            goods: data,
          })
          if(JSON.stringify(data) == '{}'){
            this.setData({
              isShow: false
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
        complete:()=>{
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
