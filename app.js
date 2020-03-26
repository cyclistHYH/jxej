App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    if(options.query){
      my.setStorageSync({
        key: 'query',
        data: options.query
      });
    }
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1} 
   if(options.query){
      my.setStorageSync({
        key: 'query',
        data: options.query
      });
    }
  },
  globalData: {
    baseUrl: 'https://ssl.ygwl.info',
    // baseUrl: 'https://static.elive99.com',
    // baseUrl: 'http://192.168.0.242',
  }
});
