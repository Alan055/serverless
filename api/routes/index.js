const Router = require('koa-router')
// const router = new Router({prefix: '/api'}) // 路由前缀
const router = new Router() // 路由前缀
const join = require('path').join

// 这里千万注意  写路由的时候  路径和接口的名字要相同 路由文件路径是/login 路由的path也应该是/login
// 如果一定不相同 那就写成对象数组的形式
const routerList = [
	'login', // 登录路由
	'register', // 注册路由
	'logout',  // 注销路由
	'reptile',  // 爬虫路由
	'movie',  // 电影列表路由
	'movieType',  // 电影类型路由
	'forgetPassword',  // 忘记密码路由
	'modifyPassword',  // 修改密码路由
	'statistical',  // 修改密码路由
	'pushMood',  // 心情墙添加路由
	'community',  // 社区墙查询路由
	'assess', // 访问上报
	'postError', // 错误上报
	'postClick', // 点击事件上报
	'postPhone', // 手机号上报
]

for (let path of routerList) {
	let rootPath = '/api/' + path // 拦截的路由名 /xxxx/xxx
	let pathname = '.' + rootPath // 路由文件的路径  ./..xxxx
	let obj = require(pathname)
	obj.routerFn(router, rootPath, obj.fn) // 注册路由
}
const templateList = ['helloworld']


for(let path of templateList){
	let pathname = './template/' + path
	let obj = require(pathname)
	obj.routerFn(router, '/'+path, obj.fn) // 注册路由
}

// console.log(router) // 查看注册的路由

module.exports = router
