// 业务逻辑  爬虫相关

const reptileModel = require('./../model/reptile')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm

const reptile = {
	async find(ctx){
		let form = getForm(ctx) // 拿到请求主体
		// 返回结果
		let result = {
			code: retCode.Success,
			data: await reptileModel.search(form)
		}
		return result
	}
}

module.exports = reptile
