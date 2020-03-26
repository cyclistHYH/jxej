const app = getApp();

Page({
  data: {
    isNull: true,
    address: [],
    addressClick: '',
  },

  toModify: function(e) {
    my.navigateTo({
      url: '/pages/address/modify/modify?id=' + e.currentTarget.dataset.id
    });
  },

  loadData: function() {
    let that = this;
    my.showLoading({
      content: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/address/list.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      success: (res) => {
        if (res.data.status == 10000) {
          if (res.data.data.length > 0) {
            var address = res.data.data;
            for (var i = 0; i < address.length; i++) {
              if (address[i].is_default == 1) {
                address[i].isChoose = true
              } else {
                address[i].isChoose = false
              }
            }
            that.setData({
              address: address,
              isNull: false
            })
          } else {
            that.setData({
              isNull: true
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
      },
    });
  },

  chooseAdd(e) {
    var that = this;
    console.log(e)
    var addressId = e.currentTarget.dataset.id;
    console.log(addressId)
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      address_id: addressId
    });
    my.navigateBack({})
  },

  onLoad(options) {
    if(options.type==0) {
      this.setData({
        addressClick: 'chooseAdd'
      })
    } else {
      this.setData({
        addressClick: ''
      })
    }
   },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
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
    	this.loadData()
		}
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
