<template>
	<view class="mask_contain" @touchmove.stop.prevent="moveStop" v-if="isHidden">
		<image :src="imagePath" class="share_img"></image>
		<view class="share_foot">
			<button class="save" open-type="share">分享好友</button>
			<view class="save" style="background: #FFAA00;">保存海报</view>
		</view>

		<view class="canvas_content">
			<canvas canvas-id="myCanvas" :style="{height: `${totalHeight}px`, width: `${totalWidth}px`}"></canvas>
		</view>

	</view>
</template>

<script>
	import {
		getwxacodeunlimit,
	} from '@/service/index.js'
	export default {
		props: ['optionsData'],
		data() {
			return {
				isHidden: false,
				totalWidth: 0.0,
				totalHeight: 0.0, //画布的高度
				canvasScale: 2.0, //
				imagePath: "",
				openSet: false,
				qrImg: '' //小程序自定义的二维码
			};
		},
		methods: {

			visable() {

				this.isHidden = !this.isHidden
				this.getCode()
			},

			getCode() {
				getwxacodeunlimit({
					url: "/pages/productDetail/productDetail?itemId=300408&client=5&recommendCode=167787"
				}).then(res => {

				}).catch(err => {

				})
				this.beginDraw()
			},

			beginDraw() {

				const systemInfo = uni.getSystemInfoSync()
				// const windowWidth = systemInfo.windowWidth
				const scale = systemInfo.windowWidth / 375.0
				const canvasScale = this.canvasScale
				console.log(scale)
				this.totalHeight = 400 * scale * canvasScale
				this.totalWidth = 280 * scale * canvasScale
				console.log(this.totalWidth)
				console.log(this.totalHeight)
				// 获取Canvas
				let ctx = uni.createCanvasContext('myCanvas', this)
				ctx.scale(this.canvasScale, this.canvasScale)
				//绘制主图背景
				this.roundRect(ctx, 0, 0, this.totalWidth, this.totalHeight, 6 * scale, '#ffffff')
				const goodsImageWidth = this.totalWidth / this.canvasScale
				var that = this
				uni.getImageInfo({
					src: this.optionsData.mediaList.find(item=>item.type === 1).url,
					success: function(res) {
						console.log(res.path)
						ctx.drawImage(res.path, 0, 0, goodsImageWidth, goodsImageWidth)
						that.drawBottomInfo(ctx, scale)
					}
				})
			},

			drawBottomInfo(ctx, scale) {
				ctx.setFillStyle('#333333')
				ctx.setFontSize(14 * scale)
				const topMargin = (this.totalWidth / this.canvasScale) + 25
				this.canvasTextAutoLine(this.optionsData.name, ctx, 10 * scale, topMargin * scale, 16 * scale, 250 * scale, 2)
				ctx.font = "normal bold 16px sans-serif"
				const priceDescStr = '¥' + this.optionsData.minPrice
				this.drawNormalText(ctx, priceDescStr, 10 * scale, (topMargin + 45) * scale, 16 * scale, '#EE1F2C', 'left', 'middle', scale)
				ctx.draw(false, () => {
					setTimeout(() => {
						this.canvasToTempImage()
					}, 200);

				})
			},

			canvasToTempImage: function() {
				//把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
				var that = this
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success: function(res) {
						console.log(res)
						var tempFilePath = res.tempFilePath
						console.log(tempFilePath)
						that.imagePath = tempFilePath
					},
					complete: function(res) {

						console.log(res)
					},
					fail: function(res) {
						console.log(res)
					}
				}, this)
			},

			moveStop() {

			},
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
			roundRect(ctx, x, y, w, h, r, c = '#fff') {

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
			},

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
			canvasTextAutoLine: function(str, ctx, initX, initY, lineHeight, maxWidth, row = 1) {
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
			},
			// 绘制只有一行的文字
			drawNormalText(ctx, str, x, y, font, style, align, baseLine) {
				ctx.setFontSize(font);
				ctx.setFillStyle(style);
				ctx.setTextAlign(align);
				ctx.setTextBaseline(baseLine);
				ctx.fillText(str, x, y);
			},
		}
	}
</script>

<style lang="less">
	.mask_contain {
		background: rgba(0, 0, 0, 0.35);
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.share_img {
			width: 560rpx;
			height: 800rpx;
			background: #fff;
			border-radius: 12rpx;
		}

		.share_foot {
			margin-top: 60rpx;
			width: 560rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			button {
				margin: 0;
			}

			.save {
				width: 260rpx;
				height: 80rpx;
				border-radius: 40rpx;
				background: #EE1F2C;
				text-align: center;
				line-height: 80rpx;
				color: #fff;
				font-size: 28rpx;
			}
		}
	}

	.canvas_content {
		border-radius: 12rpx;
		position: fixed;
		top: 20rpx;
		left: 500%;
	}
</style>
