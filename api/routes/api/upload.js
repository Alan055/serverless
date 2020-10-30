// 上传路由
const uploadbll = require('../../pub/bll/upload')
const postOnlyFile = require('../../pub/utils/common').postOnlyFile

async function fn(ctx, next) {
	let result = await uploadbll.saveFile(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: postOnlyFile,
	fn: fn
}
