// 业务逻辑  电影相关

const moiveModel = require('./../model/movie')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm

const movie = {
	async find(ctx){
		let form = getForm(ctx) // 拿到请求主体
		// 返回结果
		let result = {
			code: retCode.Success,
			data: await moiveModel.search(form)
		}
		return result
	},
	async type(ctx){
		let form = getForm(ctx) // 拿到请求主体
		// 返回结果
		let result = {
			code: retCode.Success,
			data: await moiveModel.type(form)
		}
		return result
	}
}

module.exports = movie
