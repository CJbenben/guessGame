import md5 from './md5';

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

const dateFormat = (fmt, date) => {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
};

var stringify = (params) => {
	let value = []
	Object.keys(params).forEach(key => {
		value.push(`${key}=${params[key]}`)
	})

	return value.join('&')
}

var sendDyForm = function(path, params, methodType) {


	methodType = methodType || "post";
	var form = document.createElement("form");
	form.style.position = 'fixed'
	form.style.top = '0'
	form.style.left = '0'
	form.style.right = '0'
	form.style.bottom = '0'
	form.style.background = 'rgba(0,0,0,0.5)'
	form.style.zIndex = '999'
	// form.style.position = 'fixed'
	form.setAttribute("method", methodType);
	form.setAttribute("id", 'payForm');
	form.setAttribute("action", path);
	form.setAttribute("target", '_blank');
	// form.setAttribute("onsubmit", '_blank');
	for (var key in params) {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", key);
		hiddenField.setAttribute("value", params[key]);
		form.appendChild(hiddenField);
	}
	var input = document.createElement("input");
	input.style.position = 'fixed'
	input.style.width = '300px'
	input.style.height = '50px'
	input.style.lineHeight = '50px'
	input.style.background = '#fb6a21'
	input.style.color = '#FFFFFF'
	input.style.border = 0
	input.style.borderRadius = '6px'
	input.style.textAlign = 'center'
	input.style.transform = 'translate(-50%, -50%)'
	input.style.top = '50%'
	input.style.left = '50%'

	input.setAttribute('type', 'submit')
	input.setAttribute('value', '确认支付')

	var inputCancel = document.createElement("button");
	inputCancel.style.zIndex = '99999'
	inputCancel.style.position = 'fixed'
	inputCancel.style.width = '300px'
	inputCancel.style.height = '50px'
	inputCancel.style.lineHeight = '50px'
	inputCancel.style.textAlign = 'center'
	inputCancel.style.transform = 'translate(-50%, -60%)'
	inputCancel.style.top = '62%'
	inputCancel.style.left = '50%'
	inputCancel.style.border = 0
	inputCancel.style.borderRadius = '6px'
	inputCancel.setAttribute('id', 'formCancel')
	inputCancel.innerHTML = '取消支付'
	inputCancel.setAttribute('onclick', 'deleteForm()')



	document.body.appendChild(inputCancel);
	form.appendChild(input);
	document.body.appendChild(form);
	// try{
	// 	form.submit();
	// }catch(e){
	// 	//TODO handle the exception
	//  form.setAttribute("target", '_self');
	//  form.submit();
	// }
}

//获取openid
const getStorageOpenId = () => {

	const openId = uni.getStorageSync('openId');
	return new Promise((resolve, reject) => {

		if (!openId) {

			for (var requestTime = 0; requestTime < 3; requestTime++) {

				if (requestTime < 3) {

					return requestOpenId().then(res => {

						console.log(res)
						console.log('获取openid成功' + requestTime);
						resolve(res);
					}).catch(err => {

						if (requestTime === 2) {

							console.log('获取openid失败' + requestTime);
							reject('err');
						}
					});
				}
			}

		} else {

			console.log('获取openid成功');
			resolve(openId);
		}
	});
}

import {
	wxmpOpenId,
	tokenRefresh
} from '@/service/login/index';
const requestOpenId = () => {
	return new Promise((resolve, reject) => {
		return uni.login({
			success: res => {
				console.log(res)
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				return wxmpOpenId({
					code: res.code
				}).then(openRes => {
					console.log(openRes)
					uni.setStorageSync('openId', openRes.data.openid)
					uni.setStorageSync('session_key', openRes.data.session_key)
					uni.setStorageSync('unionId', openRes.data.unionid)
					resolve(openRes.data.openid)
				}).catch(err => {
					console.log(err)
					reject(err.desc)
				})
			},
			fail: err => {

				console.log('获取code失败');
				reject(err);
			}
		})

	});
}

const refreshToken = () => {

	return new Promise((resolve, reject) => {

		const token = uni.getStorageSync('token')
		if (!token) {
			resolve()
		} else {
			const tokenSetTime = uni.getStorageSync('tokenSetTime')
			var time = dateFormat("YYYY-mm-dd", new Date())
			console.log(time)
			if (!tokenSetTime || time !== tokenSetTime) {

				return tokenRefresh().then(res => {

					console.log('刷新token成功')
					uni.setStorageSync('token', res.data.token)
					uni.setStorageSync('tokenSetTime', time)
					resolve()
				}).catch(err => {

					console.log(err)
					resolve()
				})
			} else {
				uni.setStorageSync('tokenSetTime', time)
				resolve()
			}
		}
	});
}

import {
	paymentQueryPaymentAccount,
	paymentPay
} from '@/service/order/index';

/* 支付的方法 payParam包含的参数{ownerId, storeId, channelAccountId否} */
const orderPayWithWeixin = (payParam) => {

	if (!payParam.channelAccountId) {

		paymentQueryPaymentAccount({

			ownerId: payParam.ownerId,
			// storeId: payParam.storeId,
			source: "8", // 来自沐云
			client: "mp",
		}).then(res => {

			if (!res || res.length === 0) {

				uni.showToast({
					title: "获取支付渠道失败",
					icon: "none"
				})
				return
			}

			//获取支付渠道成功,去支付
			return requestPaymentPay(res.data[0].channelAccountId, payParam.paymentNo, payParam.amount)
		}).catch(err => {

		})

	} else {

		//获取支付渠道成功,去支付
		return requestPaymentPay(payParam.channelAccountId, payParam.paymentNo, payParam.amount);
	}
}
//用户去支付
const requestPaymentPay = (channelAccountId, paymentNo, amount) => {

	return getStorageOpenId().then(res => {

		console.log(res)
		paymentPay([{

			accountType: 1,
			openid: res,
			pmtcOrderId: paymentNo,
			channelAccountId: channelAccountId,
			amount: amount,
		}]).then(payRes => {

			return payWithWeixinModel(payRes.data.ext1)
		}).catch(err => {

		})
	}).catch(err => {

		console.log('获取openid失败');
		console.log(err);
		uni.showToast({
			title: '获取openId失败',
			icon: 'none'
		})
	});
}

const payWithWeixinModel = (ext1) => {

	if (!ext1) {
		uni.showToast({
			title: '获取支付参数失败!',
			icon: 'none',
		})
		return
	}
	return new Promise((resolve, reject) => {

		const extJson = JSON.parse(ext1)
		uni.requestPayment({
			'timeStamp': extJson.timeStamp,
			'nonceStr': extJson.nonceStr,
			'package': extJson.package,
			'signType': extJson.signType,
			'paySign': extJson.paySign,
			'success': function(res) {
				console.log(res)
				uni.showToast({
					title: '支付成功!',
					duration: 2000,
					success: function() {
						resolve(res)
					},
				}, 2000)
			},
			'fail': function(res) {
				console.log(2)
				console.log(res)
				reject(res)
			},
			'complete': function(res) {

				console.log(3)
				console.log(res)
			}
		});
	});
}


import {
	router,
	RouterMount
} from '@/router.js'

export function loginOut() {

	uni.removeStorageSync("userInfo")
	uni.removeStorageSync("token")
	// uni.removeStorageSync("openId")
	uni.removeStorageSync("session_key")
	uni.removeStorageSync("tokenSetTime")
	uni.removeStorageSync("__DC_STAT_UUID")
	// router.push('/pages/login/login')
}

export function makeid() {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < 8; i += 1) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export function forn(appId, timestamp, noncestr) {
	return md5.hexMD5('a' + appId + timestamp + noncestr);
}

/**
 * 绘制圆角矩形
 * @param {Object} ctx - canvas组件的绘图上下文
 * @param {Number} x - 矩形的x坐标
 * @param {Number} y - 矩形的y坐标
 * @param {Number} w - 矩形的宽度
 * @param {Number} h - 矩形的高度
 * @param {Number} r - 矩形的圆角半径
 * @param {String} [c = 'transparent'] - 矩形的填充色
 */
function roundRect(ctx, x, y, w, h, r, c = '#fff') {

	if (w < 2 * r) {
		r = w / 2;
	}
	if (h < 2 * r) {
		r = h / 2;
	}
	ctx.beginPath();
	ctx.fillStyle = c;

	ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.lineTo(x + w, y + r);

	ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
	ctx.lineTo(x + w, y + h - r);
	ctx.lineTo(x + w - r, y + h);

	ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
	ctx.lineTo(x + r, y + h);
	ctx.lineTo(x, y + h - r);

	ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
	ctx.lineTo(x, y + r);
	ctx.lineTo(x + r, y);
	ctx.fill();
	ctx.closePath();
}

/*
  *  绘制多行文本，自动换行，超出添加...
  *
  str:要绘制的字符串
  canvas:canvas对象
  initX:绘制字符串起始x坐标
  initY:绘制字符串起始y坐标
  lineHeight:字行高，自己定义个值即可
  maxWidth: 文本最大宽度
  row: 最大行数
  */
function canvasTextAutoLine(str, ctx, initX, initY, lineHeight, maxWidth, row = 1) {
	var lineWidth = 0;
	var lastSubStrIndex = 0;
	var currentRow = 1;
	for (let i = 0; i < str.length; i++) {
		lineWidth += ctx.measureText(str[i]).width;
		if (lineWidth > maxWidth) {
			currentRow++;
			let newStr = str.substring(lastSubStrIndex, i)
			if (currentRow > row && str.length > i) {
				newStr = str.substring(lastSubStrIndex, i - 2) + '...'
			}
			ctx.fillText(newStr, initX, initY);
			initY += lineHeight;
			lineWidth = 0;
			lastSubStrIndex = i;

			if (currentRow > row) {
				break;
			}
		}
		if (i == str.length - 1) {
			ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
		}
	}
}
// 绘制只有一行的文字
function drawNormalText(ctx, str, x, y, font, style, align, baseLine) {
	ctx.setFontSize(font);
	ctx.setFillStyle(style);
	ctx.setTextAlign(align);
	ctx.setTextBaseline(baseLine);
	ctx.fillText(str, x, y);
}

function base64src(base64data) {
  
  const fsm = wx.getFileSystemManager();
  const FILE_BASE_NAME = 'tmp_base64src';
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
	const time = new Date().getTime()
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}${time}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
}


/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
function getRandomString(len){
    let _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
        min = 0, 
        max = _charStr.length-1, 
        _str = '';                    //定义随机字符串 变量
    //判断是否指定长度，否则默认长度为15
    len = len || 15;
    //循环生成字符串
    for(var i = 0, index; i < len; i++){
        index = (function(randomIndexFunc, i){         
                    return randomIndexFunc(min, max, i, randomIndexFunc);
                })(function(min, max, i, _self){
                    let indexTemp = Math.floor(Math.random()*(max-min+1)+min),
                        numStart = _charStr.length - 10;
                    if(i==0&&indexTemp >=numStart){
                        indexTemp = _self(min, max, i, _self);
                    }
                    return indexTemp ;
                }, i);
        _str += _charStr[index];
    }
    return _str + new Date().getTime();
}


module.exports = {
	getRandomString: getRandomString,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	stringify: stringify,
	sendDyForm: sendDyForm,
	// loginOut: loginOut,
	getStorageOpenId: getStorageOpenId,
	requestOpenId: requestOpenId,
	refreshToken: refreshToken,
	orderPayWithWeixin: orderPayWithWeixin,
	drawNormalText,
	canvasTextAutoLine,
	roundRect,
	base64src
}
