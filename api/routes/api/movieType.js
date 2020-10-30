// 电影类型路由
const movieBill = require('../../pub/bll/movie')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await movieBill.type(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}