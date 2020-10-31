function Art() {
	this.userInfo = {}
}


Art.prototype.onError = function () {
	window.addEventListener("error", function(err){
		const obj = {
			url: err.filename,
			msg: err.message,
			userToken: localStorage.getItem('userToken'),
			userAgent: window.navigator.userAgent,
		}
		$.post(config.url + 'postError', obj, function (res) {
			console.log('Reported successfully！')
		})
	})
}
Art.prototype.assess = function () {
	this.userInfo.ip = returnCitySN["cip"]
	this.userInfo.address = returnCitySN["cname"]
	this.userInfo.origin = window.location.origin
	this.userInfo.userAgent = window.navigator.userAgent
	this.userInfo.userToken = localStorage.getItem('userToken')
	$.post(config.url + 'assess', this.userInfo, function (res) {
		console.log('Reported successfully！')
		if(res.code === 200 && res.data){
			art.userInfo.userToken = res.data
			localStorage.setItem('userToken', res.data)
		}
	})
}

// 工厂模式
Art.prototype.init = function () {
	this.onError()
	this.assess()
}

const art = new Art()

art.init()
