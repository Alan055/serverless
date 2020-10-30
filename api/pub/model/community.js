const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const objFn = {
	// 在社区总表中添加一条数据
	async addCommunity(args) {
		let sql = `insert into community_wall (username,title,type,img_url,create_time) values (?,?,?,?,?)`
		let params = [args.username, args.title, args.type, args.imgUrl, args.createTime]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在社区总表上查询数据
	async getCommunity(args) {
		// 这里需要动态查询  即拿到指定的id  然后往前面/后面查询x条数据 因为id在数据表里面相当于分水岭一样
		let sql = ''
		if( args.direction){
			sql = `select SQL_CALC_FOUND_ROWS * from community_wall where id<? order by id desc limit ?,?;select FOUND_ROWS() as total;`
		} else { // 向下
			sql = `select SQL_CALC_FOUND_ROWS * from community_wall where id>? order by id desc limit ?,?;select FOUND_ROWS() as total;` // 这里后面不需要
		}
		console.log(sql)
		console.log(args)
		let params = [args.id, args.startItem, args.size]
		let result = await mysqlHelper.query(sql, params)
		return {
			list: result[0],
			total: result[1][0].total
		}
	},
	// 在心情墙上添加一条数据
	async addMoodList(args) {
		let sql = `insert into mood_list (username,title,img_url,create_time) values (?,?,?,?)`
		let params = [args.username, args.title, args.imgUrl, args.createTime]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在问答墙上添加一条数据
	async addQaList(args) {
		let sql = ``
		let params = []
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在分享技术墙上添加一条数据
	async addshareList(args) {
		let sql = ``
		let params = []
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在评论表中添加一条数据
	async addCommentList(args) {
		let sql = ``
		let params = []
		let result = await mysqlHelper.query(sql, params)
		return result
	},
}

module.exports = objFn