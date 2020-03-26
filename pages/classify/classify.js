const app = getApp();

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    activeNav: 0,index: 0,
    typeNav: [],
    category: [],
    isOpen: 1,
  },

  navClick: function(e) {
    let that = this;
    var typeNav = that.data.typeNav;
    that.setData({
      activeNav: e.currentTarget.dataset.index,
      category: typeNav[e.currentTarget.dataset.index].child
    })
  },

  loadData: function() {
    let that = this;
    let index = that.data.index;
    my.showLoading({
      content: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/product/pro-type.html',
      method: 'POST',
      success: (res) => {
        console.log(res)
        that.setData({
          typeNav: res.data.data,
          category: res.data.data[index].child,
          activeNav: index,
        })
      },
      complete:()=>{
        my.hideLoading();
      }
    });
		
  },
  open:function(){
      my.request({
        method: "POST",
        url: app.globalData.baseUrl+'/login/check-open.html',
        headers: {"content-type":"application/x-www-form-urlencode"},
        success: (result) => {
          console.log(result)
          if(result.data.status == 10000){
            this.setData({
              isOpen: result.data.data.value
            })
          }
          console.log(this.data.isOpen)
        }
      });
  },
  onLoad() {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let proType = app.globalData.proType;
    console.log(proType)
    if(proType != undefined){
      this.setData({
        index: app.globalData.proType.index
      })
    }
		this.loadData();
		this.open();
    console.log(this.data)
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
  },
});
