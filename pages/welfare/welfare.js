const app = getApp();
import parse from 'mini-html-parser2';
Page({
  data: {
    isShow: true,
    message: "签到成功",
    list: "",
    allDay:"",
    allDay_length: 0,
    num_after: "",num_befor: "",
    jifen: 10,
    isOver: 0,
    date: "",rule:"",oneWeek: 0
  },

  qiandao: function() {
    my.showLoading({
      content: "签到中..."
    });
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
      my.request({
        method: "post",
        url: app.globalData.baseUrl+'/register/add.html?token='+token.data,
        header:{"content-type":"application/x-www-form-urlencoded"},
        success: (res) => {
          console.log(res.data)
          if(res.status == 200){
            this.setData({
              isShow: false,
              message: res.data.message,
              // isOver: 1
            })
            my.setStorage({
              key: 'date', // 缓存数据的key
              data: this.forMate(), // 要缓存的数据
            });
            this.oneWeek();
            this.loadData();
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

  toClose: function(){
    this.setData({
      isShow: true
    })
  },
  
  oneWeek: function(){
    my.request({
      method: 'post',
      url: app.globalData.baseUrl+'/register/one-week.html?token='+ my.getStorageSync({key: 'token',}).data,
      headers: {"content-type": "application/x-www-form-urlencoded"},
      success: (result) => {
        console.log(result)
        if(result.status == 10000){
          this.setData({
            oneWeek: result.data
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
  },

  loadData: function(){
    my.showLoading({
      content: "加载中..."
    });
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
      my.request({
        method: "POST",
        url: app.globalData.baseUrl+"/register/list.html?token="+token.data,
        header:{"content-type":"application/x-www-form-urlencoded"},
        success: (res) =>{
          console.log(res.data,"qiandaoList")
          that.setData({
            list: res.data.data
          })
          let count = 0;
          for(let item of that.data.list){
            if(item != null){
              count++;
              switch(that.getWeekByDay(item.date)){
                case 1:
                    that.setData({
                      "allDay[0].d1":true
                    })
                    break;
                case 2:
                    that.setData({
                      "allDay[1].d2":true
                    })
                    break;
                case 3:
                    that.setData({
                      "allDay[2].d3":true
                    })
                    break;
                case 4:
                    that.setData({
                      "allDay[3].d4":true
                    })
                    break;
                case 5:
                    that.setData({
                      "allDay[4].d5":true
                    })
                    break;
                case 6:
                    that.setData({
                      "allDay[5].d6":true
                    })
                    break;
                case 7:
                    that.setData({
                      "allDay[6].d7":true
                    })
                    break;
              }
            }
          }
          this.setData({
            allDay_length: count
          })
          console.log(that.data,"data")
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
      })
    }
  },
  getWeekByDay: function (dayValue){
    let day = new Date(dayValue).getDay();
    if(day == 0){
      day = 7;
    }
    return day;
  },

  forMate:function () {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    if(month < 10) {
        month = "0" + month;
    }
    if(day < 10) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  },
  rule:function(){
    my.request({
      method: "POST",
      url: app.globalData.baseUrl+'/login/integral.html',
      headers: {"content-type":"application/x-www-form-urlencoded"},
      success: (result) => {
        if(result.status == 200){
          let html = result.data.data.content;
          parse(html, (err, content) => {
  　　　　　　if (!err) {
  　　　　　　　　this.setData({
                  rule: content,
  　　　　　　　　});
  　　　　　　}
  　　　　})
        }
      }
    });
  },

  onLoad() {
    this.loadData();
    this.rule();
    this.oneWeek();
  },
});
