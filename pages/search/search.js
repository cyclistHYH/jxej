const app = getApp();

Page({
  data: {
    pathHeader: app.globalData.baseUrl,
    focus: true,
    hotSearch: [],
    historySearch: [],
    isNull: true,
    product: [],
    searchVal: '',
  },

  loadData() {
    let that = this;
    my.request({
      url: app.globalData.baseUrl + '/product/keyword.html',
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          that.setData({
            hotSearch: res.data.data
          })
        }
      },
    });
    that.setData({
      historySearch: my.getStorageSync({ key: 'historySearch' }).data || []
    })
  },

  toSearch: function(e) {
    let that = this;
    my.request({
      url: app.globalData.baseUrl + '/product/pro-list.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: 1,
        product_name: e.detail.value
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          if (res.data.data.length == 0) {
            my.showToast({
              content: '暂无该商品'
            });
            that.setData({
              isNull: true
            })
          } else if (res.data.data.length > 0) {
            that.setData({
              product: res.data.data,
              isNull: false
            })
          }
        }
      },
    });
    var historySearch = that.data.historySearch;
    var isHave = false;
    if (e.detail.value != "") {
      for (var i = 0; i < historySearch.length; i++) {
        if (e.detail.value != historySearch[i]) {
          isHave = false
        } else {
          isHave = true
        }
      }
      if (!isHave) {
        if (historySearch.length < 10) {
          historySearch.unshift(e.detail.value)
        } else {
          historySearch.pop();
          historySearch.unshift(e.detail.value)
        }
        my.setStorageSync({
          key: 'historySearch', // 缓存数据的key
          data: historySearch, // 要缓存的数据
        });
        that.setData({
          historySearch: historySearch
        })
      }
    }
  },

  clearBtn: function() {
    let that = this;
    my.removeStorageSync({
      key: 'historySearch', // 缓存数据的key
    });
    that.setData({
      historySearch: []
    })
  },

  searchChange: function(e) {
    var val = e.detail.value;
    if (val == "") {
      this.setData({
        isNull: true
      })
    }
  },

  search: function() {
    let that = this;
    my.request({
      url: app.globalData.baseUrl + '/product/pro-list.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: 1,
        product_name: that.data.searchVal
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          if (res.data.data.length == 0) {
            my.showToast({
              content: '暂无该商品'
            });
            that.setData({
              isNull: true
            })
          } else if (res.data.data.length > 0) {
            that.setData({
              product: res.data.data,
              isNull: false
            })
          }
        }
      },
    });
    var historySearch = that.data.historySearch;
    var isHave = false;
    for (var i = 0; i < historySearch.length; i++) {
      if (that.data.searchVal != historySearch[i]) {
        isHave = false
      } else {
        isHave = true
      }
    }
    if (!isHave) {
      if (historySearch.length < 10) {
        historySearch.unshift(that.data.searchVal)
      } else {
        historySearch.pop();
        historySearch.unshift(that.data.searchVal)
      }
      my.setStorageSync({
        key: 'historySearch', // 缓存数据的key
        data: historySearch, // 要缓存的数据
      });
      that.setData({
        historySearch: historySearch
      })
    }
  },

  searchClick: function(e) {
    let that = this;
    var val = e.currentTarget.dataset.val;
    that.setData({
      searchVal: val
    })
    that.search()
  },

  onLoad() { },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.loadData()
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
