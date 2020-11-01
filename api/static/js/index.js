function Art() {
	this.userInfo = {}
}

// 错误上报
Art.prototype.onError = function () {
	window.addEventListener("error", function(err){
		var obj = {
			url: err.filename,
			msg: err.message,
			userToken: localStorage.getItem('userToken'),
			userAgent: window.navigator.userAgent,
		}
		$.post(config.url + 'postError', obj, function (res) {
			console.log('Error Reported successfully！')
		})
	})
}
// 访问上报
Art.prototype.assess = function () {
	this.userInfo.ip = returnCitySN["cip"]
	this.userInfo.address = returnCitySN["cname"]
	this.userInfo.origin = window.location.origin
	this.userInfo.userAgent = window.navigator.userAgent
	this.userInfo.userToken = localStorage.getItem('userToken')
	$.post(config.url + 'assess', this.userInfo, function (res) {
		console.log('Assess Reported successfully！')
		if(res.code === 200 && res.data){
			art.userInfo.userToken = res.data
			localStorage.setItem('userToken', res.data)
		}
	})
}
// 点击事件 一般用于打电话/接入qq
Art.prototype.onclick = function () {
	$('.phone').click(function (e) {
		art.postClick(e.toElement.id) // 点击事件上报
		e.preventDefault();
		if('ontouchstart' in window) {
			window.location.href = "tel:" + config.phone;
		} else {
			window.open("http://wpa.qq.com/msgrd?v=3&uin=" + config.qq + "&site=qq&menu=yes");
		}
	})
	$('.submit').click(function () {

		art.submit($('#inputPhone').val(), '', '免费试课活动')
	})
	$('.submitEmail').click(function () {
		art.submit('', $('#inputEmail').val(),'免费试课活动')
	})
}
// 点击事件上报
Art.prototype.postClick = function (elementId) {
	var obj = {
		userToken: this.userInfo.userToken,
		elementId: elementId,
		url: location.href,
	}
	$.post(config.url + 'postClick', obj, function (res) {
		console.log('Click Reported successfully！')
	})
}
// 手机号码上报
Art.prototype.postPhone = function (phone, email ,type){
	var obj = {
		userToken: this.userInfo.userToken,
		url: location.href,
		phone: phone,
		email: email,
		type: type,
	}
	$.post(config.url + 'postPhone', obj, function (res) {
		console.log('Phone Reported successfully！')
	})
}
// 提交手机号
Art.prototype.submit = function(phone, email ,type){
	this.postPhone(phone, email ,type)
}



// 工厂模式
Art.prototype.init = function () {
	this.onError()
	this.assess()
	this.onclick()
}

var art = new Art()

art.init()
