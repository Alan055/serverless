const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const reptile = {
	async search(args){
		if(!args.startDate){
			args.startDate = moment(0).format("YYYY-MM-DD HH:mm:ss")
			args.endDate = moment().format("YYYY-MM-DD HH:mm:ss")
		}
		// let sql = `select SQL_CALC_FOUND_ROWS * from movie_data where name like "%${args.keyword}%" and type=? and release_date>=? and release_date<=? order by id asc limit ?,?;select FOUND_ROWS() as total;`;
		// let params = [ args.type||'喜剧片', args.startDate, args.endDate, args.pageNumber*args.pageSize, parseInt(args.pageSize)]
		// let result = await mysqlHelper.query(sql, params)
		const sql3 = `select * from users`
		let result = await mysqlHelper.query(sql3)
		console.log(result)
		return {
			list: result,
			total: result
		}
	},
	// 查询每一个分类的总数  和 分类表里面的总数
	async type(args){
		let sql = 'select * from movie_type;' // 查总数
		let result = await mysqlHelper.query(sql, [])

		// 查分类总数
		let sql0 = "SELECT "
		for(let val of result){
			sql0 += `SUM(type='${val.type_name}') AS '${val.id}',`
		}
		sql0 = sql0.substr(0,sql0.length-1) // 去掉末尾逗号
		sql0 += ' FROM movie_data;'
		result0 = await mysqlHelper.query(sql0, [])

		return {
			typeList: result,
			totalList : result0[0]
		}
	}
}

module.exports = reptile
