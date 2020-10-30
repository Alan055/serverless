// 创建一些假数据
const config = require('./../../config/config')
const mysqlHelper = require('./../db/mysql-helper')

const userinfo = {
	// 添加一条数据
	async add(args) {
		let sql = 'insert into userlist (username, password, create_date, email) values(?, ?, ?, ?)'
		let params = [args.username, args.password, args.date, args.email]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 根据用户名查找一条数据
	async getByUserName(args) {
		let sql = 'select id, username, password, email, permission from userlist where username=?'
		let params = [args.username]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 通过userid去查用户数据
	async getByUserId(id){
		let sql = 'select id, username, email, permission from userlist where id=?'
		let params = [id]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 根据username得到数量
	async getCountByUserName(args){
		let sql = 'select count(1) as username from userlist where username=?'
		let params = [args.username]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 根据邮箱找到所有的用户名
	async getUsernameForEmail(args){
		let sql = 'select username from userlist where email=?'
		let params = [args.email]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 添加一条验证码数据
	async addVerifyCode(args){
		let sql = 'insert into verify_code (user, code, create_time, expire_time) values(?, ?, ?, ?)'
		let params = [args.user,args.code, args.createTime, args.expireTime]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 找到所有关于每个user的验证码
	async getVerifyCode(args){
		let sql = 'select id,expire_time from verify_code where user=? order by id desc'
		let params = [args.user]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 修改密码
	async modifyPassword(args){
		let sql = 'update userlist set password=? where username=?'
		let params = [args.password,args.username]
		let result = await mysqlHelper.query(sql, params)
		return result
	}

}

module.exports = userinfo
