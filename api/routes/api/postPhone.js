// 点击事件上报
const bill = require('../../pub/bll/phone')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await bill.postClick(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
