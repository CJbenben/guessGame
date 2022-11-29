import { osspolicySignature } from '@/service/index.js'
async function uploadOss({
	filePath,
	name
}) {
	let resp = await osspolicySignature() //请求后台获取oss信息
	//直接获取code可能不太对。。。可能外面还有一层
	console.log(resp, '234')
	if (resp.code === "0") {
		let {
			data
		} = resp //根据后台返回的值而取
		console.log(data, '234')
		let fileType = filePath.substring(filePath.lastIndexOf('.')) || '.jpg' //获取图片类型后缀 .jpg .png
		// 正常的情况下，我们上传到oss都需要对文件进行重新命名以便我们进行更加合理的管理方式，
		// 比如 项目名称/模块名称/年/月/日/随意的字符串.图片格式 ，这里我就只获取图片格式了，
		let key = `${data.dir}${name}${fileType}` //那么我们上传到oss上，路径就是 test123.png || test123.jpg ...
		const formData = {
				key, //文件名
				policy: data.policy, //后台获取超时时间
				OSSAccessKeyId: data.accessid, //后台获取临时ID
				success_action_status: '200', //让服务端返回200,不然，默认会返回204
				signature: data.signature //后台获取签名
			}
		console.log(formData, 'formData234')
		console.log(formData, 'formData234')
		let [err, result] = await uni.uploadFile({
			url: data.host, //阿里云的存储地址，可以后端返回给你，也可以前端自己写上
			filePath, //要上传的临时文件路径
			name: 'file',
			formData: {
				key, //文件名
				policy: data.policy, //后台获取超时时间
				OSSAccessKeyId: data.accessid, //后台获取临时ID
				success_action_status: '200', //让服务端返回200,不然，默认会返回204
				signature: data.signature //后台获取签名
			}
		})
		if (err) {
			console.log(err, 'err234')
			console.log(result, 'result')
			//  上传错误了。。。可以做点什么
		} else {
			console.log(result, 'result')
			return data.host + '/' + key //上传成功后，将我们所自定义的key（文件路径名）返回出去
		}
 
	}
}

module.exports = {
	uploadOss: uploadOss
}
