Page({
  data: {
    courier:{},
    data:{}
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      courier: JSON.parse(options.courier)
    })
    console.log(this.data.courier)
		if(this.data.courier.result == false){
			my.alert({
				title: '提示',
				content: this.data.courier.message 
			});
		} else {
			let arr=[];
			let data = this.data.courier.data;
			for(let i=0; i< data.length; i++){
				let obj={};
				obj.title = data[i].time;
				obj.description = data[i].context;
				arr.push(obj);
			}
			this.setData({
				data: arr
			})
			console.log(this.data.data)
		}
  },
});
