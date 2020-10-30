// 上传路由
// const uploadbll = require('../../pub/bll/upload')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	console.log(typeof  ctx.request.body.a)
	ctx.body = {code:200,data:'12'}
	// let result = await uploadbll.saveFile(ctx)
	// ctx.body = result
}

async function  a(){
	return await new Promise((resolve) => {
		resolve({code:200,data:777})
	})
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
