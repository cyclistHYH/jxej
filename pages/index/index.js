const app=getApp();
import parse from 'mini-html-parser2';

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    carousel: ['/images/banner.png','/images/banner.png','/images/banner.png'],
    activeSwiper: 0,
    product: [
      // {
      //   img: '/images/productImg1.jpg',
      //   title: '凯速国潮风巨轮健腹轮',
      //   volume: 100,
      //   currentPrice: 99.00,
      //   originalPrice: 199.00,
      // }
    ],
    isOpen: 1,
    pao:"",
    select: []
  },


  swiperChange:function(e){
    let that=this;
    that.setData({
      activeSwiper: e.detail.current
    })
  },

  loadData:function(){
    let that=this;
    // my.showLoading({
    //   content: "加载中..."
    // });
    my.request({
      url: app.globalData.baseUrl + '/index/index.html',
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.status==10000) {
          that.setData({
            carousel: res.data.data.banner,
            product: res.data.data.proList
          })
        }
      },
      // complete:()=>{
      //   my.hideLoading();
      // },
    });
  },
  selectArea: function(){
     my.request({
      url: app.globalData.baseUrl + "/product/pro-type.html",
      method: "POST",
      headers: {"content-type":"application/x-www-form-urlencoded"},
      success: (res) => {
        console.log(res)
        if(res.data.status == 10000){
          let arr = [];
          for(let item of res.data.data){
            arr.push(item.name);
          }
          my.optionsSelect({
            title: "小区选择",
            optionsOne: arr,
            selectedOneIndex: 2,
            positiveString: "确定",
            negativeString: "取消",
            success(res) {
              console.log(res.selectedOneIndex,"p")
              let index = res.selectedOneIndex;
              console.log(typeof index)
              if((typeof index) == "number"){
                index = index<0 ? 0 : index;
                app.globalData.proType = {
                  index: index,
                }
                my.switchTab({
                  url: '/pages/classify/classify'
                });
              } else{
                
              }
            }
          });
        }
      }
    })
  },
  open:function(){
      my.request({
        method: "POST",
        url: app.globalData.baseUrl+'/login/check-open.html',
        headers: {"content-type":"application/x-www-form-urlencode"},
        success: (result) => {
          // console.log(result)
          if(result.data.status == 10000){
            this.setData({
              isOpen: result.data.data.value
            })
          }
        }
      });
  },

  loadAdv:function(){
    my.request({
      method: "post",
      url: app.globalData.baseUrl+'/login/pao.html',
      headers: {"content-type":"application/x-www-form-urlencoded"},
      success: (result) => {
        // console.log(result.data.data,"pao")
				let html = result.data.data.content;
				parse(html, (err, content) => {
	　　　　　　if (!err) {
	　　　　　　　　result.data.data.content = content
	　　　　　　}
          })
        this.setData({
          pao: result.data.data
        })
      }
    });
  },

  onLoad() {
    // 页面加载
    // this.selectArea();
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.loadAdv();
    this.open();
    this.loadData();
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
      title: '京兴e家',
      desc: '便民服务商城，支持自提、配送和快递',
      path: 'pages/index/index',
    };
  },
});
