const fs = require('fs');
const join = require('path').join; // 文件拼接链接  根据环境自动选择是 / or \
const readline = require('readline');
const rm = require('rimraf') // 删除一个文件或文件夹 不管是否为空都可以删除
const moment = require('moment')

var list = [] // 每个文件的注释消息汇总
var total = 0

// 入口函数
async function getJsonFiles(jsonPath) {
	// 初始化
	list = []
	total = 0
	let data = {
		codeNum: 0, // 总js代码行数
		jsNum: 0, // js行数
		noteNum: 0, // 注释行数
	}
	let targetName = join('', 'test.js')
	fs.writeFileSync(targetName, '') // 如果没有文件就创建  有就写入控制符  且数据初始化为空字符串
	let testJS = fs.readFileSync(targetName, 'utf-8') // 拿到这个文件
	function findJsonFile(path) {
		let files = fs.readdirSync(path); // 这个是读取path路径下的所有文件和文件夹 数组的元素全部都是字符串
		for (let val of files) {
			let dir = join(path, val) // 拼接各个文件的路径
			let stat = fs.statSync(dir) // 读取这个路径文件类型
			if (stat.isDirectory()) { // 如果是文件夹
				findJsonFile(dir); // 递归
			} else { // 不是文件夹  就是文件
				// 读取文件 直接汇总到一个文件中
				if (val.includes('.js')) { // 纯js文件
					let txt = fs.readFileSync(dir, 'utf-8');
					fs.appendFileSync(targetName, txt, 'utf-8')
					fs.appendFileSync(targetName, '\n', 'utf-8') // 追加回车
					total++
					calcJS_geraner(dir.replace(jsonPath,''), txt, val, jsonPath)


				} else if (val.search(/\.vue|\.html/) > -1) { // vue等文件

					let txt = fs.readFileSync(dir, 'utf-8');
					let arr = txt.replace(/\r\n|\n/g, '##@@').match(/<script.*?>(.*?)<\/script>/ig);
					if (!arr) {
						console.log("没有js代码的文件：" + dir)
						continue
					}
					let text = ''
					for (let v of arr) {
						fs.appendFileSync(targetName, v.replace(/##@@/g, '\n').replace(/<script.*?>/, '').replace('<\/script>', ''), 'utf-8')
						fs.appendFileSync(targetName, '\n', 'utf-8') // 追加回车
						text += v.replace(/##@@/g, '\n').replace(/<script.*?>/, '').replace('<\/script>', '') + '\n'
					}
					total++
					calcJS_geraner(dir.replace(jsonPath,''), text, val, )
				}
			}
		}

	}

	findJsonFile(jsonPath);
	let resulet = null
	await caclJS(targetName, data, jsonPath).then((res)=>{
		console.log(res)
		resulet = res
	})
	return {
		list: list,
		total: total,
		sum: resulet
	}

}

// 计算js的行数
async function caclJS(path, data, jsonPath) {
	return await new Promise((resolve,reject)=>{
		const json = readline.createInterface({
			input: fs.createReadStream(path)
		})
		json.on('line', (line) => {
			if (line.trim() !== '') {
				data.codeNum++
				line.search(/\*\/|\/\*|\s\/\/|\*/) > -1 && data.noteNum++
				line.trim().search(/^[//]|^[/*]|^[*]|^[*/]/) === -1 && data.jsNum++
			}
		})
		json.on('close', () => {
			fs.unlinkSync(path);
			rm(jsonPath,function () {})
			resolve(data)
			// console.log('总JS代码行数：' + data.codeNum)
			// console.log('实际JS代码行数：' + data.jsNum)
			// console.log('注释代码行数：' + data.noteNum)
			// console.log('注释率：' + parseInt(data.noteNum / (data.noteNum + data.jsNum) * 100) + '%')
			// console.log("本次检测的检测规则为：文件中带有.js .vue .html 的文件！")

		})
	})

}


// 计算单个文件的注释率
function calcJS_geraner(path1, txt, name) {
	let path = name+ new Date().getTime()
	fs.writeFileSync(path, '') // 创建一个新的文档  用来计算当前js的注释率
	fs.appendFileSync(path, txt, 'utf-8') // 写入数据
	let data = {
		codeNum: 0, // 总js代码行数
		jsNum: 0, // js行数
		noteNum: 0, // 注释行数
	}

	const json = readline.createInterface({
		input: fs.createReadStream(path)
	})
	json.on('line', (line) => {
		if (line.trim() !== '') {
			data.codeNum++
			line.search(/\*\/|\/\*|\s\/\/|\*/) > -1 && data.noteNum++
			line.trim().search(/^[//]|^[/\*]|^[*]|^[*/]/) === -1 && data.jsNum++
		}
	})
	json.on('close', () => {
		fs.unlinkSync(path); // 删除该文件
		data.name = name
		data.path = path1
		data.rate = (data.noteNum / (data.noteNum + data.jsNum) * 100).toFixed(2)
		list.push(data)
	})
}


module.exports = getJsonFiles



