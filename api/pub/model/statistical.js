const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const reptile = {
	// 写入数据
	async setData(args){
		let sql = `insert into log (user, ip, create_time, remark) values(?, ?, ?, ?)`;
		let params = [args.user, args.ip, args.createTime, args.remark]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 查询统计数据 查询三个数据  历史访问总数  今日访问总数  注册的总用户数
	async getData(args){
		let sql = `select count(1) as logTotal from log;
		select count(1) as logTotalToday from log where create_time>=?;
		select count(1) as userTotal from userlist;`;
		let params = [args.today]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
}

module.exports = reptile
