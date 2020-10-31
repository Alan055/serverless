const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const model = {
	// async search(args){
	// 	const sql3 = `select * from assess`
	// 	let result = await mysqlHelper.query(sql3)
	// 	return {
	// 		list: result,
	// 		total: result
	// 	}
	// },
	// 写入一条error记录的数据
	async setError(args){
		let sql = "insert into error (url, useragent, msg, error_time, user_token) values ($1, $2, $3, $4, $5)"
		const params = [
			args.url,
			args.userAgent,
			args.msg,
			moment().format('YYYY-MM-DD HH:mm:ss'),
			args.userToken,
		]
		let result = await mysqlHelper.query(sql, params)

		return result
	}
}

module.exports = model
