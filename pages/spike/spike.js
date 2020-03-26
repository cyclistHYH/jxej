const app = getApp();
// let timer = require("../../utils/timer")

Page({
  data: {
    spike: [],
    pathHeader: app.globalData.baseUrl,
    date: {},
    timer: "",
    isOver: 2,
    isShow: true
  },
  loadData: function() {
    my.showLoading({
      content: '加载中...',
    });
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;

    if (token == null || token == "" || token == undefined) {
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
      my.request({
        method: "POST",
        url: app.globalData.baseUrl + '/activity/list.html?token=' + my.getStorageSync({
          key: 'token', // 缓存数据的key
        }).data,
        data: {
          type: 2
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data, "秒杀商品")
          if (res.status == 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              res.data.data[i].hh = "";
              res.data.data[i].mm = "";
              res.data.data[i].ss = "";
              res.data.data[i].isOver = -1;
              if(res.data.data[i].people_num == 0){
                this.setData({
                  isOver: 2
                })
              }
            }
            this.setData({
              spike: res.data.data,
            });
            if(JSON.stringify(res.data.data)=='{}'){
              this.setData({
                isShow: false
              })
            }
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
  timer: function(e) {
    var that = this;
    setInterval(() => {
      var tempSpike = that.data.spike;
      var now = new Date().getTime();
      for (var i = 0; i < tempSpike.length; i++) {
        var startTime = new Date(tempSpike[i].start_date.replace("-", "/").replace("-", "/")).getTime();
        if (startTime > now) {
          tempSpike[i].isOver = -1;
          let ts = startTime - now;

          tempSpike[i].hh = that.checkTime(Math.floor(ts / 1000 / 3600));     // 计算剩余小时
          tempSpike[i].mm = that.checkTime(Math.floor(ts / 1000 / 60 % 60)); // 计算剩余分钟
          tempSpike[i].ss = that.checkTime(Math.floor((ts / 1000) % 60));  // 秒数
        }
        else {
          var endTime = new Date(tempSpike[i].end_date.replace("-", "/").replace("-", "/")).getTime();
          let ts = endTime - now;
          if (ts <= 0) {
            tempSpike[i].isOver = 1;
          } else {
            if(this.data.isOver == 2){
              tempSpike[i].isOver = 2;
            } else{
              tempSpike[i].isOver = 0;
            }
            tempSpike[i].hh = that.checkTime(Math.floor(ts / 1000 / 3600));     // 计算剩余小时
            tempSpike[i].mm = that.checkTime(Math.floor(ts / 1000 / 60 % 60)); // 计算剩余分钟
            tempSpike[i].ss = that.checkTime(Math.floor((ts / 1000) % 60));  // 秒数
          }
        }
        // console.log(i + "-" + tempSpike[i].hh + ":" + tempSpike[i].mm + ":" + tempSpike[i].ss);
      }
      that.setData({
        spike: tempSpike
      })
    }, 1000)
  },
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  onLoad() {
    this.loadData();
  },
  onReady() {
    // 页面加载完成
    this.timer();
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
