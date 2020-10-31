function dev() {
	return {
		url: '/api/'
	}
}

function product() {
	return {
		url: ''
	}
}

const config = env === 'dev' ? dev() : product()
