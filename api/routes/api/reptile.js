// 爬虫查询路由
const reptile = require('../../pub/bll/reptile')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await reptile.find(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
