// helloworld路由
// const bill = require('../../pub/bll/community')
const http = require('../../pub/utils/common').getOnly
const env = require('../../static/js/env.js');

async function fn(ctx, next) {
	await ctx.render('index', {
		userId: ctx.session.key,
		env: env,
		title: '中间件',
		list: [
			{label: '这是ejs', value: '1'},
			{label: '这是ejs', value: '2'},
			{label: '这是ejs', value: '3'},
			{label: '这是ejs', value: '4'},
			{label: '这是ejs', value: '5'},
			{label: '这是ejs', value: '6'},
			{label: '这是ejs', value: '7'},
		]
	})
}

module.exports = {
	routerFn: http,
	fn: fn
}
