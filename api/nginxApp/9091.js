var Koa = require('koa')
let app = new Koa()
const Router = require('koa-router')
const router = new Router()
router.get('/',function (ctx) {
	ctx.body = '123'
})
app.use(router.routes(),router.allowedMethods()) // 全部一起配置  启动路由

app.listen(9091, () => { // 启动服务 监听端口
	console.log(`启动了9091端口`)
});
