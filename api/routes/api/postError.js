// error统计上报
const assessBill = require('../../pub/bll/postError')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await assessBill.postError(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
