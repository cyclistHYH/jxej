const app = getApp();
Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    list: [],
    type: "",price: 0
  },
  
  navigateBack(e) {
    console.log(e,"youhhhh")
    if(this.data.type == 1){
      my.alert({
        title: '提示' ,
        content: "使用成功",
        success:()=>{
          my.navigateBack();
          let pages = getCurrentPages();
          let prevPages = pages[pages.length - 2];
          prevPages.setData({
            coupon_id: e.currentTarget.dataset.id,
            coupon_money: e.currentTarget.dataset.price,
          })
        }
      });
    }else{
      my.navigateTo({
        url: "/pages/index/index"
      });
    }
  },
  loadData:function(){
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
        method:"POST",
        url: app.globalData.baseUrl+'/coupon/list.html?token='+token,
        success: (res) => {
          console.log(res)
          if(res.data.status == 10000){
            let list = res.data.data;
            if(this.data.price >= 0){
              let arr = [];
							let item = 0;
              for(let i=0; i<list.length; i++){
                if(list[i].money < this.data.price){
                  arr[item] = list[i];
									item++;
                }
              }
              this.setData({
                list: arr
              })
							console.log(this.data.list,"list")
            }else{
              let arr = [];
							let item = 0;
              for(let i=0; i<list.length; i++){
                arr[item] = list[i];
                item++;
              }
              this.setData({
                list: arr
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
        complete:()=>{
          my.hideLoading();
        }
      });
    }
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      type: options.type,
      price: options.price
    })
    this.loadData();
  },
});
