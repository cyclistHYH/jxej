const app = getApp();

Page({
  data: {
    id: '',
    order: '',
  },

  loadData: function() {
    let that = this;
    my.request({
      url: app.globalData.baseUrl + '/order/view.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: that.data.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          that.setData({
            order: res.data.data
          })
        }
      },
    });
  },

  onLoad(options) {
    this.setData({
      id: options.order_id
    })
    this.loadData();
  },
});
