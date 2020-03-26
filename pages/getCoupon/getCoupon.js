const app = getApp();
Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    list: ""
  },
  loadData:function(){
    my.showLoading({
      content: "加载中..."
    })
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
        method:"POST",
        url: app.globalData.baseUrl+'/coupon/receive-list.html?token='+token,
        success: (res) => {
          console.log(res.data.data,"优惠券")
          this.setData({
            list: res.data.data
          })
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

  getting: function(e){
    my.showLoading({
      content:"领取中..."
    });
    my.request({
      method:"POST",
      url: app.globalData.baseUrl+"/coupon/receive.html?token="+my.getStorageSync({key:"token"}).data,
      headers:{"content-type":"application/x-www-form-urlencoded"},
      data:{
        type_id:e.currentTarget.dataset.type
      },
      success:(res)=>{
        if(res.data.status == 10000){
          my.alert({
            title: '提示',
            content: "领取成功" ,
            success:()=>{
              this.onLoad();
            }
          });
        }
      },
      complete:()=>{
        my.hideLoading();
      }
    })
  },

  getted: function(){
    my.alert({
      title: '提示',
      content: "该优惠券已领取" 
    });
  },

  onLoad() {
    this.loadData();
  },
});
