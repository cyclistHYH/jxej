const app = getApp();
Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    delivery_status: 0,
    nickName:"一串昵称",
    des:"一串描述",
    avatar:'',
    isAnbao: "不安保",
    tabCheck:"left",
    type: 0,
    list:''
  },
  loadData:function(){
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;
    if(token == null || token == undefined || token == ""){
      my.alert({
        title: '提示',
        content: "请先登录",
        success: () =>{
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    }else{
      let userInfo = my.getStorageSync({key:"userInfo"}).data;

      this.setData({
        avatar: userInfo.avatar,
        nickName: userInfo.nickName
      })
    }
  },
  onOff:function(){
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;
    if(token == null || token == undefined || token == ""){
      my.alert({
        title: '提示',
        content: "请先登录",
        success: () =>{
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    } else{
      my.request({
        method: "POST",
        url: app.globalData.baseUrl+'/shop-user/change-delivery-status.html?token='+token,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          delivery_status: this.data.delivery_status,
        },
        success: (res) => {
          console.log(res.data.status);
          if(res.data.status == 10000){
            if(this.data.delivery_status == 0){
              this.setData({
                delivery_status: 1,
                isAnbao:"可安保"
              })
              my.setStorage({
                key: 'delivery_status', // 缓存数据的key
                data: this.data.delivery_status, // 要缓存的数据
              });
              my.setStorage({
                key: 'isAnbao', // 缓存数据的key
                data: "可安保", // 要缓存的数据
              });
              my.alert({
              title:"提示",
              content: "开启成功！"
            })
            }else{
              this.setData({
                delivery_status: 0,
                isAnbao:"不安保"
              })
              my.setStorage({
                key: 'delivery_status', // 缓存数据的key
                data: this.data.delivery_status, // 要缓存的数据
              });
              my.setStorage({
                key: 'isAnbao', // 缓存数据的key
                data: "不安保", // 要缓存的数据
              });
              my.alert({
              title:"提示",
              content: "关闭成功！"
            })
            }
          }else{
            my.alert({
              title:"提示",
              content: "开启失败！"
            })
          }
        },
      });
    }
  },
  orderList:function(){
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;
    if(token == null || token == undefined || token == ""){
      my.alert({
        title: '提示',
        content: "请先登录",
        success: () =>{
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    } else{
      my.request({
        method:"POST",
        url: app.globalData.baseUrl+'/shop-user/delivery-list.html?token='+token,
        headers:{"content-type":"application/x-www-form-urlencoded"},
        data:{
          type: this.data.type
        },
        success: (res) => {
          console.log(res.data)
          if(res.status == 200){
            this.setData({
              list: res.data.data.list
            })
          }
        },
      });
    }
  },
  sending:function(){
    this.setData({
      tabCheck:"left",
      type: 0
    })
    this.orderList();
  },
  sended:function(){
    this.setData({
      tabCheck:"right",
      type: 1
    });
    this.orderList();
  },
  confirmBtn:function(e){
    console.log(e);
    let token = my.getStorageSync({
      key: 'token', // 缓存数据的key
    }).data;
    if(token == null || token == undefined || token == ""){
      my.alert({
        title: '提示',
        content: "请先登录",
        success: () =>{
          my.switchTab({
            url: '/pages/mine/mine',
          });
        }
      });
    } else{
      my.request({
        method:"POST",
        url:app.globalData.baseUrl+"/shop-user/ordercompleted.html?token="+token,
        headers:{"content-type":"application/x-www-form-urlencoded"},
        data:{
          order_id: e.currentTarget.dataset.orderId
        },
        success: (res) =>{
          console.log(res.data)
          if(res.data.status == 10000){
            my.alert({
              title: '提示',
              content: res.data.message 
            });
          }else{
            my.alert({
              title: '提示',
              content: res.data.message
            });
          }
        }
      })
    }
  },
  onLoad() {
    let delivery_status = parseInt(my.getStorageSync({key: 'delivery_status',}).data);
    let isAnbao = my.getStorageSync({key: 'isAnbao',}).data;
    if(delivery_status && isAnbao){
      this.setData({
        delivery_status: delivery_status,
        isAnbao: isAnbao
      })
    }
    this.orderList();
    this.loadData();
  },
});
