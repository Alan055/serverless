// 项目统计路由
const statisticalBll = require('../../pub/bll/statistical')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await statisticalBll.getData(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
