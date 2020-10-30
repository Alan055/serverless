const fs = require("fs")

// fs.readlink('helloword.txt',function (err,res) {
// 	console.log(res)
// })


let newPaht = 'new.jpg'
let targetPath = 'icon.jpg'
// 剪切文件  是通过二进制流的形式传输  所以管道两端需要有"水桶"(文件)去接收
let newFile = fs.createWriteStream(newPaht) // 先创建一个文件 作为接收文件的容器
let targetFile = fs.createReadStream(targetPath) // 然后读取 需要转移的文件
targetFile.pipe(newFile)// 复制目标文件的二进制流  通过管道流入 新文件中  即形成了复制功能
targetFile.on('close', function () { // 监听是否传输完成 这里是监听的目标文件关闭的时候
	console.log("完成了")
	fs.unlinkSync(targetPath) // 最后删除文件
})

// ------ 封装起来就做成了一个剪切功能的函数
