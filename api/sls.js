var Koa = require('koa')
	, logger = require('koa-logger') // 日志中间件
	, json = require('koa-json') // 返回json格式的响应
	, views = require('koa-views') // 模板渲染中间件
	, onerror = require('koa-onerror') // 错误处理中间件
	, join = require('path').join; // 文件路径拼接方法
let app = new Koa()
let Swig = require('koa-swig')


const config = require('./config/config') // 链接配置

// error handler
onerror(app);


// global middlewares 全局中间件
app.use(require('koa-bodyparser')({extended: true,enableType: ['json', 'form', 'text']}));
// app.use(koaBody({
// 	multipart: true,
// 	formidable: {
// 		maxFileSize: 500*1024*1024 // 设置上传文件大小最大限制，默认2M
// 	}
// }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(join(__dirname, 'static'))) // 静态文件中间件 接口中获取静态资源不需要带static

app.use(views(join(__dirname, './views'), {
	extension: 'swig'
	// map: {html: 'ejs' }
}))


const message = require('./pub/utils/retcode').message
// 这个是拦截器
app.use(async (ctx, next) => { // next()之前  是拿到接口响应之后  还没开始操作
	const start = new Date;
	await next() 	// next()之后  是通过路由操作结束之后  可以拿到即将返回的数据
	console.log(ctx.body)
	ctx.url.includes('api') && (ctx.body.msg = message[ctx.body.code]) // 增加msg 中文消息提示
	console.log('%s %s 处理时间：%s' + 'ms', ctx.method, ctx.url, new Date - start); // 这里是检测每次接口处理所需要花费的时间
});

// 设置session缓存
const session = require('koa-session') // 缓存
const RedisStore = require('koa2-session-redis') // 一个redis的仓库
app.keys = ['testalan'] // 这里面内容随便填，一般是随机字符串。作用是用来加密cookie  一定不能删除
const redis_conf = {
	key: 'session', // cookie key
	maxAge: config.REDIS.maxAge, // 最大的缓存时间
	overwrite: true, // 是否可以重写
	httpOnly: true, //
	rolling: false, // 强制在每个响应上设置会话标识符cookie 到期时间为maxAge  即是否每次都刷新cookie
	sign: true, // 是否使用签名
	store: new RedisStore({
		host: config.REDIS.host,
		port: config.REDIS.port,
		password: config.REDIS.password,
	})
};
app.use(session(redis_conf, app)); // 第一次写后台的童鞋可能不明白redis和session    看config

// 路由配置
const router = require('./routes/index')
app.use(router.routes(), router.allowedMethods()) // 全部一起配置  启动路由

// error-handling
const getForm = require('./pub/utils/common').getForm // 拿到请求的数据方法
app.on('error', (err, ctx) => { // 服务报错的情况下
	console.error('服务器报错，入参为：', getForm(ctx))
	console.log(err)
});

module.exports = app // 这个有热更新

// app.listen(config.SERVER_PORT, '0.0.0.0' , () => { // 启动服务 监听端口
// 	console.log(`启动服务，监听端口号为： ${config.SERVER_PORT}`)
// });
