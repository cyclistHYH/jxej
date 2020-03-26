const app = getApp();
Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    order_id: "",pinData: "",
    goods: "",
    date:{},
    isOver:0
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
        title: '提示',
        content: "请登录"
      });
    } else{
      my.request({
        method: "POST",
        url: app.globalData.baseUrl+'/order/view.html?token='+token,
				headers:{"content-type":"application/x-www-form-urlencoded"},
				data:{
					order_id:this.data.order_id
				},
        success: (res) => {
          console.log(res.data,"pintuanOrder")
          if(res.data.status == 10000){
            
            this.setData({
              goods: res.data.data
            })
            console.log(this.data.goods,"goods")
            }
        },
        complete:()=>{
          my.hideLoading();
        }
      });
    }
  },
	timer:function(e){
		setInterval(() =>{
			let ts = new Date(e) - new Date();
			console.log(ts,"mmmmmmmmmmmm")
			if(ts <= 0){
				let obj = {};
				obj.hh = "00";obj.mm = "00";obj.ss = "00";
				this.setData({
					isOver: 1,
					date: obj,
				})
			} else{
				let result = {};
				result.hh = checkTime(Math.floor(ts / 1000 / 3600));     // 计算剩余小时
				result.mm = checkTime(Math.floor(ts / 1000 / 60 % 60)); // 计算剩余分钟
				result.ss = checkTime(Math.floor((ts / 1000 ) % 60));  // 秒数
				function checkTime(i) {
					if (i < 10) {
						i = "0" + i;
					}
					return i;
				}
				this.setData({
					date: result
				})
				console.log(this.data.date)
			}
		},1000)
	},
  share:function(){
    my.showSharePanel();
  },
  shareOver:function(){
    my.alert({
      title: '提示',
      content: "活动结束" 
    });
  },
  onLoad(options) {
		console.log(options)
    this.setData({
      order_id: options.order_id,
      pinData: JSON.parse(options.pinData)
    })
    this.loadData();
		let e = String(this.data.pinData.end_date)
		this.timer(e)
  },

  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拼团活动',
      desc: '拼团活动正在进行中，邀你一起',
      path: 'pages/fightGroupDetails/fightGroupDetails',
    };
  },
});
