const app = getApp();

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    goods: [],
    page: 1,
    pageSize: 10,
    load: true,
    id: '',
    remindTxt: '',
    isRemind: false,
  },

  loadData: function(e) {
    var that = this;
    my.showLoading({
      content: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/product/pro-list.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: 1,
        pagenumber: 1,
        numberperpage: 10,
        product_type_id: e
      },
      success: (res) => {
        that.setData({
          goods: res.data.data
        })
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  remind(e) {
    let that = this;
    that.setData({
      isRemind: true,
      remindTxt: e
    })
    setTimeout(() => {
      that.setData({
        isRemind: false
      })
    }, 2000);
  },

  onLoad(options) {
    // 页面加载
    this.loadData(options.id);
    this.setData({
      id: options.id
    })
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

  // 分页
  pageData: function() {
    var that = this
    let token = my.getStorageSync({ key: 'token' });
    let numberperpage = that.data.pageSize
    let pagenumber = that.data.page
    var id = that.data.id;
    my.showLoading({
      title: '加载中',
    });
    my.request({
      url: app.globalData.baseUrl + '/product/pro-list.html?token=' + token.data,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: 1,
        numberperpage: numberperpage,
        pagenumber: pagenumber,
        product_type_id: id
      },
      method: 'post',
      success: function(res) {
        if (res.data.data.length > 0) {
          that.setData({
            goods: that.data.goods.concat(res.data.data)
          })
        } else {
          that.remind('暂无更多数据')
          that.setData({
            load: false
          })
        }

      },
      complete: function() {
        my.hideLoading();
      }
    })
  },

  onReachBottom() {
    // 页面被拉到底部
    var that = this;
    var page = that.data.page
    that.setData({
      page: ++page
    });
    if (that.data.load == true) {
      that.pageData()
    } else {
      that.remind('暂无更多数据')
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    // return {
    //   title: 'My App',
    //   desc: 'My App description',
    //   path: 'pages/index/index',
    // };
  },
});
