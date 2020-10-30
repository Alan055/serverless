// 业务逻辑  获取文件相关

const retCode = require('./../utils/retcode').retCode
const moment = require('moment')

var fs = require('fs');
var join = require('path').join; // 文件拼接链接  根据环境自动选择是 / or \
const readline = require('readline');
let unzip = require('unzip')
const calc = require('./../../run') // 计算函数

async function io(file,jsonPath) {
	return await new Promise(resolve => {
		let fileRAM = fs.createReadStream(file.path) // 拿到内存中的文件
		let path = join('upload', file.name)
		let writeStream = fs.createWriteStream(path) // 创建一个二进制文件 此时里面是没有数据的
		fileRAM.pipe(writeStream) // 使用pipe通道将二进流转移到指定文件中
		fileRAM.on('close', function () { // 监听是否完成了文件剪切
			// fs.mkdirSync(jsonPath)
			let zip = fs.createReadStream(path)
			zip.pipe(unzip.Extract({path: join(jsonPath)}).on('close',function () {
				resolve(true)
			})) // 解压到指定目录下
		})
	})

}


const reptile = {
	async saveFile(ctx) { // 保存文件
		let file = ctx.req.files.file // 文件传过来会先保存在内存中  需要先去找到位置
		let bol = false
		let jsonPath = 'app_calc' + moment().valueOf()
		await io(file,jsonPath).then((res) => { // 是否解压成功
			bol = res
		})
		let result = {
			code: retCode.Success,
			data: null
		}

		if (!bol) { // 解压失败
			result.code = retCode.UnzipFail;
		} else { // 解压成功 开始计算注释率
			result.data = await calc(jsonPath)
		}
		return result
	}
}


module.exports = reptile
