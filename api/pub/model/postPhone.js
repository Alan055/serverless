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
	async setPhone(args){
		let sql = "insert into phone (user_token, url, phone, email,type, time) values ($1, $2, $3, $4, $5, $6)"
		const params = [
			args.userToken,
			args.url,
			args.phone || '',
			args.email || '',
			args.type,
			moment().format('YYYY-MM-DD HH:mm:ss'),
		]
		let result = await mysqlHelper.query(sql, params)

		return result
	}
}

module.exports = model
