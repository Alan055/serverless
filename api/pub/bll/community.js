// 业务逻辑  社区墙相关

const poolModal = require('./../model/community')
const retCode = require('./../utils/retcode').retCode
const getForm = require('./../utils/common').getForm
const moment = require('moment')
const typeObj = {mood: 1,} // 每个数据表的类型

const obj = {
	// 查询社区墙的数据
	async searchCommunity(ctx){
		let form = getForm(ctx) // 拿到请求主体
		let result = {code: retCode.Success, data: null} // 返回结果初始化
		let search = await poolModal.getCommunity({
			direction: JSON.parse(form.direction),
			id: parseInt(form.startId),
			size: parseInt(form.pageSize),
			startItem: form.pageNumber * parseInt(form.pageSize),
		})
		result.data = search
		return result

	},
	// 添加一条 心情墙的业务
	async pushMood(ctx) {
		let form = getForm(ctx) // 拿到请求主体
		let result = {code: retCode.Success, data: null} // 返回结果
		if(ctx.session === undefined){ // session过期了
			result.code = retCode.SessionExpired  // 设置为过期了
			return result
		}
		// 拿到数据 往心情墙里面添加数据  成功后再添加到社区墙中
		let MoodResult = await poolModal.addMoodList({ // 心情墙的type 1  可以不传
			username: ctx.session.username, // 发表的用户名
			title: form.title, // 发表的心情文字
			// type: form.type,
			imgUrl: form.imgUrl ? form.imgUrl : '', // 图片 如果没有就传空字符串
			createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
		})
		if(MoodResult.insertId <=0){ // 如果添加数据出错的话
			result.code = retCode.Fail
			return result
		}
		// 再添加数据到社区墙中
		let communityResult = await poolModal.addCommunity({ //
			username: ctx.session.username, // 发表的用户名
			title: form.title, // 发表的心情文字
			type: typeObj.mood,
			imgUrl: form.imgUrl ? form.imgUrl : '', // 图片 如果没有就传空字符串
			createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
		})
		if(communityResult.insertId <=0){ // 如果添加数据出错的话
			result.code = retCode.Fail
			return result
		}
		result.data = true
		return result
	},

}

module.exports = obj
