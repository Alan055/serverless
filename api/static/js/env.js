// const env = 'dev'
const env = 'product'
if("object" == typeof module && "object" == typeof module.exports){
	module.exports = env
}

