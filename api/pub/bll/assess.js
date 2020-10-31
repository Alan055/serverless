// 业务逻辑  页面访问统计

const assessModel = require('./../model/assess')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm
const utils = require('./../utils/common')
const md5 = require('md5')
const moment = require('moment')

const model = {
	// 事件上报
	async setAssess(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		let token = form.userToken ? '' : md5(moment().format('YYYY-MM-DD HH:mm:ss') + utils.al_random(10000, 1000000))
		!form.userToken && (form.userToken = token)
		// 返回结果
		let res = await assessModel.setAssess(form)
		if (res.severity === 'ERROR') {
			return {code: retCode.Fail, data: e}
		} else {
			return {code: retCode.Success, data: token}
		}
	},
	// 查看访问统计数据
	async getAssess(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		// 返回结果
		let res = await assessModel.search(form)
		if (res.severity === 'ERROR') {
			return {code: retCode.Fail, data: e}
		} else {
			return {code: retCode.Success, data: res}
		}
	}
}

module.exports = model
