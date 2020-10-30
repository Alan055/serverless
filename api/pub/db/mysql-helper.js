const pg = require('pg')
const config = require('./../../config/config')
const pool = new pg.Pool(config.MYSQL)

let query = function (sql, args) {
	return new Promise((resolve, reject) => {
		pool.connect(function (isErr, connection, done) {
			if(isErr){
				console.log("数据库链接失败！")
				reject(isErr)
			}else{
				connection.query(sql,args,(err,result)=>{
					done()
					err ? reject(err) : resolve(result)
				})
			}
		})
	})
}

module.exports = {query}
