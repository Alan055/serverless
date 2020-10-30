// 电影路由
const movieBill = require('../../pub/bll/movie')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await movieBill.find(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}