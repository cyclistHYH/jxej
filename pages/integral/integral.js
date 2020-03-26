const app = getApp();

Page({
  data: {
    log: [
      {
        content: "抱歉，暂无数据~ "
      }
    ],
    integral: ""
  },
  
  loadData: function(){
    my.showLoading({
      content: '加载中...',
    });
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;

    if(token == "" || token == undefined || token == null){
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
      my.request({
        method: "POST",
        url: app.globalData.baseUrl + '/shop-user/view.html?token=' + token,
        headers:{"content-type":"application/x-www-form-urlencoded"},
        success: (res) => {
          console.log(res.data)
          if(res.data.status == 10000){
            this.setData({
              integral: res.data.data.integral
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
      });

      my.request({
        method: "POST",
        url: app.globalData.baseUrl + '/integral-log/list.html?token=' + token,
        headers:{"content-type":"application/x-www-form-urlencoded"},
        success: (res) => {
          console.log(res.data)
          if(res.data.status == 10000){
            this.setData({
              log: res.data.data
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
        complete: ()=>{
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
    console.log(12)
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
