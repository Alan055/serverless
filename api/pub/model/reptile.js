const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const reptile = {
	async search(args){
		if(!args.startDate){
			args.startDate = moment(0).format("YYYY-MM-DD HH:mm:ss")
			args.endDate = moment().format("YYYY-MM-DD HH:mm:ss")
		}
		let sql = `select SQL_CALC_FOUND_ROWS * from reptile where title like "%${args.keyword}%" and answer>=? and create_date>=? and create_date<=? order by id asc limit ?,?;select FOUND_ROWS() as total;`;
		let params = [ args.answerNum||0, args.startDate, args.endDate, args.pageNumber*args.pageSize, parseInt(args.pageSize)]
		let result = await mysqlHelper.query(sql, params)
		return {
			list: result[0],
			total: result[1][0].total
		}
	},
}

module.exports = reptile