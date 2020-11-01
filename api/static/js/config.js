function dev() {
	return {
		url: '/api/',
		phone: '17817010677',
		qq: '450033101',
		qrCode: ''
	}
}

function product() {
	return {
		url: '',
		phone: '17817010677',
		qq: '296688308', // 这里的qq需要去注册腾讯商业广告的认证 才可能关联qq
		qrCode: ''
	}
}

const config = env === 'dev' ? dev() : product()
