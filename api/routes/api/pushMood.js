// 电影路由
const bill = require('../../pub/bll/community')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await bill.pushMood(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}