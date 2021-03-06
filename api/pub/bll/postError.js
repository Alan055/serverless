// 业务逻辑  页面访问统计

const errorModel = require('./../model/postError')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm

const bll = {
	// 事件上报
	async postError(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		// 返回结果
		let res = await errorModel.setError(form)
		if (res.severity === 'ERROR') {
			return {code: retCode.Fail, data: e}
		} else {
			return {code: retCode.Success, data: null}
		}
	},
	// 查看访问统计数据
	// async getAssess(ctx) {
	// 	let form = getForm(ctx) // 拿到请求主体
	// 	// 返回结果
	// 	let res = await assessModel.search(form)
	// 	if (res.severity === 'ERROR') {
	// 		return {code: retCode.Fail, data: e}
	// 	} else {
	// 		return {code: retCode.Success, data: res}
	// 	}
	// }
}

module.exports = bll
