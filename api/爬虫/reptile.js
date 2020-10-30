// 爬虫

const request = require('request')
const cheerio = require('cheerio')
const fn = require('./../common/common').fn
let iconv = require('iconv-lite');
let startNum = 516284

let timer = setInterval(function () {
	reptile(startNum++)
}, 100)

function reptile(num) {
	request('http://ask.csdn.net/questions/' + num, (err, res, body) => {
		if (err) {
			console.log(err)
		} else {
			let $ = cheerio.load(res.body);
			let title = $($('div.questions_detail_con>dl>dt')[0]).text().trim().replace(/"/g,'')
			if(!title){
				console.log("页面数据不合适：" + num)
				return
			}
			let answer = $($('div.answer_sort_con p')[0]).text().replace('个回答', '')
			let date = $($('em.ask_pub_date')[0]).text().replace('发布于：','')
			let url = 'https://ask.csdn.net/questions/' + num

			const sql = `insert into reptile values(null, "${title}", ${answer?parseInt(answer):0},"${date}","${url}","${moment().format('YYYY-MM-DD HH:mm:ss')}")`
			console.log(sql)
			fn(sql).then(result=>{
				console.log('添加成功：'+result.insertId)
				if(result.insertId > 10000000){
				clearInterval(timer)
			}
			}).catch(err=>{
				console.log(err)
			})
		}

	})

}


exports.index = reptile
