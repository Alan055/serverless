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
	async setClick(args){
		let sql = "insert into click (user_token, click_id, url, click_time) values ($1, $2, $3, $4)"
		const params = [
			args.userToken,
			args.elementId,
			args.url,
			moment().format('YYYY-MM-DD HH:mm:ss'),
		]
		let result = await mysqlHelper.query(sql, params)

		return result
	}
}

module.exports = model
