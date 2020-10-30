const multiparty = require('koa2-multiparty')
// 公共函数 很多地方都可以用的到的

// router中  某个接口同时允许get和post两种方式 的函数
function getPost(router, path, callback){
	router.get(path, callback)
	router.post(path, callback)
}
// router中  某个接口只允许get方式 的函数
function getOnly(router, path, callback){ // 一般是都支持滴 除了获取文件 只能用get
	router.get(path, callback)
}
// router中  某个接口只允许post方式 的函数
function postOnly(router, path, callback){ // 一般是都支持滴  除了获取文件 只能用getAQAq
	router.post(path, callback)
}
// router中  文件上传模式  只支持post
function postOnlyFile(router, path, callback){ // 一般是都支持滴  除了获取文件 只能用get
	router.post(path, multiparty(), callback)
}
// 根据get和post返回对应的请求主体参数
function getForm(ctx){
	return ctx.request[ctx.method == 'GET' ? 'query' : 'body'] // 拿到请求主体
}
// 随机数
function al_random(x,y){
	// 随机数 在x，y之间的整数,不包含y
	!y && (y = 0)
	return Math.floor(Math.random() * (x - y) + y)
}
// 获取客户端地址
function getClientIp(req) {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};
module.exports = {
	getPost, // router中  某个接口同时允许get和post两种方式 的函数
	getOnly, // router中  某个接口只允许get方式 的函数
	postOnly, // router中  某个接口只允许post方式 的函数
	postOnlyFile, // router中  某件上传模式  只支持post
	getForm, // 根据get和post返回对应的请求主体参数
	al_random, // 随机数
	getClientIp, // 获取客户端地址
}
