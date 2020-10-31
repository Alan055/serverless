// 访问统计
const assessBill = require('../../pub/bll/assess')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await assessBill.setAssess(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
