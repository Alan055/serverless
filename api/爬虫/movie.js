// 爬虫

const request = require('request')
const cheerio = require('cheerio')
const fn = require('./../common/common').fn
const moment = require('moment')
let iconv = require('iconv-lite');
let startNum = 516284

let type_nameList = []

function search(url,type,total) {
	let num = 1
	let timer = setInterval(function () {
		if(num > Math.ceil(total/20)){
			clearInterval(timer)
		}else{
			search_init(url,type,num++)
		}
	}, 300)

}

function search_init(url,type,num) {
	let uri = url + (num == 1 ? '' : `index_${num}.html`)
	request({
		uri: uri,
		method: 'GET',
		encoding: null,
	},(err, res, body) => {
		if (err) {
			console.log(err)
		} else {
			let $ = cheerio.load(iconv.decode(body, 'gb2312'));
			let eles = $('.listBox li')
			if (Array.from(eles).length == 0){
				console.log('无数据页面：' + uri)
				return
			}
			let list = []
			for(let val of Array.from(eles)){
				list.push({
					name: $(val).find('.listimg img').attr('alt'),
					imgUrl: $(val).find('.listimg img').attr('src'),
					jumpUrl: $(val).find('.listimg a').attr('href'),
					releaseDate: $(val).find('.listInfo p:last-child').text().replace('时间：',''),
					createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
				})
			}
			let  sql = `insert into movie_data values`
			for(let val of list){
				sql += `(null, "${val.name}", "${val.jumpUrl}", "${val.imgUrl}", "${val.releaseDate}", "${val.createDate}", "${type}"),`
			}
			sql = sql.substr(0, sql.length-1)// 去掉最后一个逗号
			fn(sql).then(result => {
				let lastObj = type_nameList[type_nameList.length-1]
				if(type == lastObj.name && num == Math.ceil(lastObj.total/20)) {
					console.log("查询结束了******************************************************")
				}
			}).catch(err => {
				console.log(err)
			})
		}
	})
}

function init() {
	request({
		uri: 'http://www.6vhao.tv/',
		method: 'GET',
		encoding: null,
	}, (err, res, body) => {
		if (err) {
			console.log(err)
		} else {
			let $ = cheerio.load(iconv.decode(body, 'gb2312'));

			let eles = $('.mainleft .channeltype h2>a')
			for(let val of Array.from(eles)){
				let id = $(val).next().attr('id')
				type_nameList.push({name: $(val).text().replace('>>',''),url: $(val).attr('href'),total: Number($('#span_'+id).text())})
			}
			// 找到大类 然后写入数据库
			let  sqlType = `insert into movie_type values`
			for(let val of type_nameList){
				sqlType += `(null, "${val.name}", "${val.url}", "${val.total}"),`
			}
			sqlType = sqlType.substr(0,sqlType.length-1)// 去掉最后一个逗号
			fn(sqlType).then(result => {
				console.log('电影类型数据表 添加成功')
				// 然后查找每个类型电影资源
				let index = 0
				let val = type_nameList[index]
				search(val.url, val.name, val.total)

				let timer1 = setInterval(()=>{
					if(index >= type_nameList.length-1){
						clearInterval(timer1)
						return
					}
					index++
					val = type_nameList[index]
					search(val.url,val.name,val.total)
				},2000)


				// for(let val of type_nameList){
				// 	search(val.url,val.name,val.total)
				// }
				// search(type_nameList[0].url,type_nameList[0].name,type_nameList[0].total)
			}).catch(err => {
				console.log(err)
			})
		}
	})

}


exports.index = init
