// 业务逻辑  统计数据相关

const statisticalModel = require('./../model/statistical')
const userModel = require('./../model/userinfo')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm
const getClientIp = require('./../utils/common').getClientIp
const moment = require('moment')



const reptile = {
	async setData(ctx){ // 写入数据

	},
	async getData(ctx){ // 拿数据
		let form = getForm(ctx) // 拿到请求主体
		// 返回结果
		let result = {
			code: retCode.Success,
			data: null
		}
		let setResult = await statisticalModel.setData({
			ip: getClientIp(ctx.req),
			user: ctx.session.id ? (await userModel.getByUserId(ctx.session.id))[0].username: '游客',
			createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
			remark: '进入网站',
		})
		// 判断是否写入成功
		if(setResult.insertId<=0){
			result.code = retCode.Fail
			return result
		}
		// 然后查询日志数据 查询三个数据  历史访问总数  今日访问总数  注册的总用户数
		let getResult = await statisticalModel.getData({
			today: moment().format("YYYY-MM-DD")
		})
		let obj = {}
		getResult.map(e=>{Object.assign(obj, e[0])})
		result.data = obj

		return result
	}
}

module.exports = reptile
