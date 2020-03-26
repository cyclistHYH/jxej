const citysJSON = require('/utils/city_json.js');
const app = getApp();

Page({
  data: {
    id: '',
    isRemind: false,
    provinces: '',
    city: '',
    area: '',
    isDefault: true,
    name: '',
    phone: '',
    addDetails: ''
  },

  cityChoose: function() {
    my.multiLevelSelect({
      title: '请选择所在省市区',//级联选择标题
      list: citysJSON.citys,//引入的js
      success: (res) => {
        this.setData({
          isRemind: false,
          provinces: res.result[0].name,
          city: res.result[1].name,
          area: res.result[2].name,
        })
      }
    })
  },

  loadData: function() {
    let that = this;
    my.showLoading({
      title: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/address/view.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        address_id: that.data.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 10000) {
          var defaults;
          if (res.data.data.is_default == 1) {
            defaults = true
          } else {
            defaults = false
          }
          that.setData({
            name: res.data.data.consignee,
            phone: res.data.data.mobile,
            addDetails: res.data.data.address,
            provinces: res.data.data.province,
            city: res.data.data.city,
            area: res.data.data.district,
            isDefault: defaults
          })
        }
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  toModify: function(e) {
    let that = this;
    var token = my.getStorageSync({ key: 'token' }).data;
    var rel = /^1[3456789]\d{9}$/;
    var check;
    if (e.detail.value.name == "") {
      my.alert({
        title: '提示',
        content: '请输入姓名',
        buttonText: '我知道了'
      })
      return false
    } if (e.detail.value.phone == "") {
      my.alert({
        title: '提示',
        content: '请输入手机号码',
        buttonText: '我知道了'
      })
      return false
    } else if (!rel.test(e.detail.value.phone)) {
      my.alert({
        title: '提示',
        content: '请输入正确的手机号',
        buttonText: '我知道了'
      })
      return false
    } if (that.data.provinces == "") {
      my.alert({
        title: '提示',
        content: '请选择地区',
        buttonText: '我知道了'
      })
      return false
    }
    if (e.detail.value.addDetails == "") {
      my.alert({
        title: '提示',
        content: '请输入详细地址',
        buttonText: '我知道了'
      })
      return false
    }
    else if (/^[0-9]+$/.test(e.detail.value.addDetails)) {
      my.alert({
        title: '提示',
        content: '详细地址不能为全数字',
        buttonText: '我知道了'
      })
      return false
    } else {
      if (e.detail.value.isDefault) {
        check = 1
      } else {
        check = 0
      }
      my.showLoading({
        title: "加载中..."
      });
      my.request({
        url: app.globalData.baseUrl + '/address/add.html?token=' + token,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          address_id: that.data.id,
          consignee: e.detail.value.name,
          mobile: e.detail.value.phone,
          address: e.detail.value.addDetails,
          province: that.data.provinces,
          city: that.data.city,
          district: that.data.area,
          isDefault: check
        },
        success: (res) => {
          if (res.data.status == 10000) {
            my.alert({
              title: '提示',
              content: res.data.message,
              success: () => {
                my.navigateBack({

                });
              }
            });
          }
        },
        complete: () => {
          my.hideLoading();
        },
      });
    }
  },

  toDefault: function(e) {
    let that = this;
   
    if (e.detail.value == true) {
      my.request({
        url: app.globalData.baseUrl + '/address/default.html?token=' + my.getStorageSync({ key: 'token' }).data,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          address_id: that.data.id
        },
        success: (res) => {
          if (res.data.status == 10000) {
            my.alert({
              title: '提示',
              content: res.data.message,
              success: () => {

              }
            });
          }
        },
        
      });
    }
  },

  toDelete: function() {
    let that = this;
    my.showLoading({
      title: "加载中..."
    });
    my.request({
      url: app.globalData.baseUrl + '/address/delete.html?token=' + my.getStorageSync({ key: 'token' }).data,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        address_id: that.data.id
      },
      success: (res) => {
        if (res.data.status == 10000) {
          my.alert({
            title: '提示',
            content: res.data.message,
            success: () => {
              my.navigateBack({
                
              });
            }
          });
        }
      },
      complete: () => {
        my.hideLoading();
      },
    });
  },

  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.loadData()
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
  onReachBottom() {
    // 页面被拉到底部
  },
});
