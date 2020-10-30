// 业务逻辑  登录、注册

const usermodel = require('./../model/userinfo')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm
const moment = require('moment')
const config = require('./../../config/config')
const email = require('emailjs')
const utils = require('./../utils/common')
const serverEmail = email.server.connect(config.email) // 配置email

function testListFn(status) {
	return function (args, obj) {
		switch (status) {
			case "welcome":
				return {
					title:'欢迎新童鞋',
					text: `您好，${args.username}，非常感谢您加入Alan社区，快来开启社区之旅吧，学习新技能提升自己，或者分享您的技能，让大家学习膜拜吧！分享成功，还有机会将您的信息发布到社区中，成为社区贡献者的一员，让您在跳槽加薪时底气十足！`}
			case "forgetPassword":
				return {
					title: '找回密码',
					text: `尊贵的用户，您好，${obj.list.length>0?`您在本社区创建的账号有: ${obj.list.map(v=>(v.username)).join('，')}，找回密码请点击此链接： ${config.www+`/modifyPassword?email=${args.email}&verifyCode=${obj.code}`} `:`您在本社区未创建过账号，请点击此链接：${config.www+'/register'}注册新的账号`}`
				}
			case "modifyPassword":
				return {
					title: '修改密码成功',
					text: `尊敬的 ${args.username} 用户，Alan社区提醒您，您的密码已修改成功，请妥善保管，如非本人操作，请尽快找回密码！Alan社区祝您生活愉快，工作顺利~`
				}

		}
		// let textList = {
		// 	welcome: {
		// 		title:'欢迎新童鞋',
		// 		text: `您好，${args.username}，非常感谢您加入Alan社区，快来开启社区之旅吧，学习新技能提升自己，或者分享您的技能，让大家学习膜拜吧！分享成功，还有机会将您的信息发布到社区中，成为社区贡献者的一员，让您在跳槽加薪时底气十足！`},
		// 	forgetPassword: {
		// 		title: '找回密码',
		// 		text: `尊贵的用户，您好，${obj.list.length>0?`您在本社区创建的账号有: ${obj.list.map(v=>(v.username)).join('，')}，找回密码请点击此链接： ${config.www+`/modifyPassword?email=${args.email}&verifyCode=${obj.code}`} `:`您在本社区未创建过账号，请点击此链接：${config.www+'/register'}注册新的账号`}`
		// 	},
		// 	modifyPassword: {
		// 		title: '修改密码成功',
		// 		text: `尊敬的 ${args.username} 用户，Alan社区提醒您，您的密码已修改成功，请妥善保管，如非本人操作，请尽快找回密码！Alan社区祝您生活愉快，工作顺利~`
		// 	}
		// }
	}
}


const userinfo = {
	// 注册
	async register(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		// 入参
		const args = {
			username: form.username,
			password: form.password,
			date: moment().format('YYYY-MM-DD HH:mm:ss'),
			email: form.email,
		}
		// 返回结果
		let result = {
			code: retCode.Success,
			data: false
		}
		// 验证是否为空
		if (!args.username || !args.password) {
			result.code = retCode.ArgsError // 参数错误
			return result
		}
		// 根据用户名得到用户数量
		let userNumResult = await usermodel.getCountByUserName(args)
		if (userNumResult[0].username > 0) { // 说明该账号已被注册咯
			result.code = retCode.UserExisted
			return result
		}
		// 插入注册表
		let userResult = await usermodel.add(args)
		if (userResult.insertId <= 0) { // 说明没有写入到数据库中
			result.code = retCode.Fail
			return result // 其实这个是多余的
		}
		// 插入成功  然后查询到那条数据
		userResult = await usermodel.getByUserName(args)
		// 注册后直接登录

		ctx.session = userResult[0] // 将用户的id存在session中 保持一段时间登录  这里是在将用户id存在redis表中
		await ctx.cookies.set("username",userResult[0].username,{
			maxAge: 1000*60,   // cookie有效时长
		}) // 写入cookie
		console.log(66666,ctx.cookies.get("username"))
		let res = userResult[0]
		this.sendEmail(res,'welcome') // 发送邮件
		result.data = {
			userId: res.id,
			userName: res.username,
			email: res.email,
			permission: res.permission
		}
		return result
	},
	// 登录
	async login(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		// 入参
		const args = {
			username: form.username,
			password: form.password,
		}
		// 返回结果
		let result = {
			code: retCode.Success,
			data: false
		}
		// 验证是否为空
		if (!args.username || !args.password) {
			result.code = retCode.ArgsError // 参数错误
			return result
		}
		// 根据用户名是否存在
		let userResult = await usermodel.getByUserName(args)
		if (userResult.length == 0) { // 说明该账号未注册
			result.code = retCode.UserNotExist
			return result
		}
		// 用户名或者密码错误
		if (userResult[0].username != args.username || userResult[0].password != args.password) {
			result.code = retCode.UsernameOrPasswordError
			return result
		}
		// 这里解释一下  这里的session是根据客户端浏览器的不同而唯一的  redis会自动生成一个key值  这个key在同一个浏览器上是相同的 所以不同客户端就不会造成覆盖和误删
		ctx.session = {id: userResult[0].id,username: userResult[0].username,email: userResult[0].email,permission:userResult[0].permission} // 将用户的id存在session中 保持一段时间登录  这里是在将用户id存在redis表中
		// ctx.session.id =  userResult[0].id // 将用户的id存在session中 保持一段时间登录  这里是在将用户id存在redis表中
		let res = userResult[0]
		result.data = {
			userId: res.id,
			username: res.username,
			email: res.email,
			permission: res.permission
		}
		return result
	},
	// 注销 // 这个是同步的
	logout(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		console.log(ctx.session)
		ctx.session.username && (ctx.session = null) // 删除缓存
		ctx.cookies.set('username','',{expires:new Date(new Date().getTime()-1)})
		return {code: retCode.Success, data: true,}
	},
	// 找回密码  发送邮箱
	async forgetPassword(ctx){
		let form = getForm(ctx) // 拿到请求主体
		// 入参
		const args = {
			email: form.email,
		}
		// 返回结果
		let result = {
			code: retCode.Success,
			data: false
		}
		// 验证是否为空
		if (!args.email) {
			result.code = retCode.ArgsError // 参数错误
			return result
		}
		// 查询该邮箱中所有的用户名

		let userResult = await usermodel.getUsernameForEmail(args)
		let code = utils.al_random(10000,100000)
		await usermodel.addVerifyCode({
			user: args.email,
			code: code,
			createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
			expireTime: moment().add(config.expireTime,'minute').format('YYYY-MM-DD HH:mm:ss'),
		})
		this.sendEmail(args,'forgetPassword', {list: userResult, code: code})
		result.data = '请查看邮箱地址进行找回密码！'
		return result

	},
	// 找回密码
	async modifyPassword(ctx){
		let form = getForm(ctx) // 拿到请求主体
		// 入参
		const args = {
			username: form.username,
			passwordPrev: form.passwordPrev,
			passwordNext: form.passwordNext,
			email: form.email,
			code: form.code,
		}
		// 返回结果
		let result = {
			code: retCode.Success,
			data: false
		}

		// 这里有两个逻辑 1、找回密码  2、登录了修改密码
		if(this.passwordPrev){ // 2

		}else{ // 1
			if(![args.username, args.passwordNext, args.email, args.code].every(e=>(e))){
				result.code = retCode.ArgsError // 参数错误
				return result
			}
			// 查找验证码是否正确 切没有过期
			let verifyCodeResult = await usermodel.getVerifyCode({ // 查找所有的验证码
				code: args.code,
				user: args.email,
			})
			if(verifyCodeResult.length){
				if(moment().isAfter(verifyCodeResult[0].expire_time)){ // 已过期
					result.code = retCode.verifyCodeExpire // 参数错误
					return result
				}
			}else{ // 没有查到
				result.code = retCode.verifyCodeError // 参数错误
				return result
			}
			// 执行到这里  就是没有过期 就去修改密码
			let modifyResult = usermodel.modifyPassword({
				password: args.passwordNext,
				username: args.username,
			})
			if(modifyResult.insertId<=0){
				result.code = retCode.Fail
				return result // 其实这个是多余的
			}

		}


		// 修改成功  然后查询到那条数据
		let userResult = await usermodel.getByUserName(args)
		// 注册后直接登录
		ctx.session = {id: userResult[0].id} // 将用户的id存在session中 保持一段时间登录  这里是在将用户id存在redis表中
		let res = userResult[0]
		this.sendEmail(res,'modifyPassword') // 发送邮件
		result.data = {
			userId: res.id,
			userName: res.username,
			email: res.email,
			permission: res.permission
		}
		return result



	},
	// 发送邮箱
	sendEmail(args,status,obj){
		let str = ''
		let textList = testListFn(status)(args,obj)

		serverEmail.send({
			text: textList.text,
			from: 'alan0555@qq.com',
			to: args.email,
			subject: `来自Alan社区的邮件（${textList.title}）`
		})
	},
	// ...
}

module.exports = userinfo



