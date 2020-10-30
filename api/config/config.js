// 配置文件  用户区分开发环境和生产环境

const production = { // 生产
	SERVER_PORT: 3000, // 服务器断开配置
	REDIS: { // redis配置
		host: 'localhost',
		port: 3306,
		password: '1234',
		maxAge: 3600000,
	},
	MYSQL: { // mysql数据库配置
		host: 'localhsot',
		port: '3306',
		user: 'root',
		password: 'new-password',
		database: 'alanSQL',
		supportBigNumbers: true,
		multipleStatements: true,
		timezone: 'utc'
	},
	email: {
		user: 'alan0555@qq.com',
		password: 'hhazzkkgajykbhec',
		host: 'smtp.qq.com',
		ssl: true,
	}
}

const development = { // 开发
	SERVER_PORT: 3000, // 服务器断开配置
	REDIS: { // redis配置 这里特别说明一下
		/*
		* 后台没有前端那种 key value的缓存机制 所以只能开一个新的数据库 但要求比mysql这种数据库读取快很多的那种
		* 然后就出来了redis仓库  它是一个读写效率极高的key-value数据库
		* 使用方法： 写在redis   https://github.com/microsoftarchive/redis/releases
		* 然后启动
		* 然后 设置密码 （百度）
		* 然后就是下面的这些配置了 连接redis仓库 类似于mysql 但是没有账号  只需要密码连接
		* 代码使用就是   ctx.session.key = value  删除是 ctx.session.key = value
			*/
		host: 'localhost', // 本地地址
		port: 6379, // 一般的端口都是6379
		password: 'test123', // 公司电脑 redis的密码
		maxAge: 3600000, // 最大的缓存时间
	},
	MYSQL: { // mysql数据库配置
		host: '10.0.0.10', // 内网
		port: '5432', //
		// host: 'postgres-i1qoc62r.sql.tencentcdb.com', // 公网
		// port: '3986',
		user: 'tencentdb_i1qoc62r',
		password: 'j2,M8n1_)cIaQ0N',
		database: 'tencentdb_i1qoc62r', // 指定使用这个数据库
		poolSize: 5,
		poolIdleTimeout: 30000,
		reapIntervalMillis: 10000

	},
	email: {
		user: 'alan0555@qq.com',
		password: 'hhazzkkgajykbhec',
		host: 'smtp.qq.com',
		ssl: true,
	},
	www: 'http://localhost:8080', // 前端域名
	expireTime: 5, // 验证码过期时间  分钟

}

const config = development // 选择开发/生产模式

module.exports = config // 输出
