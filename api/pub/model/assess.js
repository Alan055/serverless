const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const reptile = {
	async search(args){
		const sql3 = `select * from assess`
		let result = await mysqlHelper.query(sql3)
		return {
			list: result,
			total: result
		}
	},
	// 写入一条页面访问的数据
	async setAssess(args){
		let sql = "insert into assess (user_ip, user_mac, assess_time, origin, useragent, user_token) values ($1, $2, $3, $4, $5, $6)"
		const params = [
			args.ip,
			args.address,
			moment().format('YYYY-MM-DD HH:mm:ss'),
			args.origin,
			args.userAgent,
			args.userToken,
		]
		let result = await mysqlHelper.query(sql, params)
		return result
	}
}

module.exports = reptile
