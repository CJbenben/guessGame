<template>
	<view class="contain">
		<view class="mask" :style="{background: isShow || shareShow? 'rgba(0,0,0, 0.5)':'rgba(0,0,0, 0.0)',zIndex: isShow || shareShow? '9999 !important':'-1'}">
			<!-- <image class="shareImg" v-if="shareShow" :src="imagePath"></image> -->
			<image class="share_cancel" v-if="shareShow" src="../static/cacel.png" @click="shareShow=false"></image>
			<view class="save" v-if="shareShow" @click="savePic()">保存图片</view>
			<view class="canvas_content">
				<canvas id="myCanvas12" canvas-id="myCanvas" :style="{height: `${totalHeight}px`, width: `${totalWidth}px`}"></canvas>
			</view>
		</view>
		<image class="shareImg" :style="{zIndex: isShow? '9999 !important':'-1', opacity: isShow ? '1' : '0'}" :src="imagePath"></image>
		<view class="foot" :style="{bottom: isShow? '0rpx':'-550rpx',zIndex: isShow? '9999 !important':'-1'}">
			<scroll-view class="share_img_scroll" scroll-x>
				<view class="share_img_list">
					<image class="share_img_item" v-for="(item, index) in shareData.shareInfo.shareTemplateImages" :key="index" :src="item"
					 @click="selectTemplateImg(index)"></image>
				</view>
			</scroll-view>
			<view class="share_top">
				<button class="share_item" open-type="share">
					<image class="share_img" src="../static/meetingDetail/wechat.png"></image>
					<view class="share_title">微信好友</view>
				</button>
				<view class="share_item" @click="savePic()">
					<image class="share_img" src="../static/meetingDetail/report.png"></image>
					<view class="share_title">保存图片</view>
				</view>
			</view>
			<view class="cancel" @click="miss()">取消</view>
		</view>
	</view>
</template>

<script>
	import {
		drawNormalText,
		canvasTextAutoLine,
		roundRect,
		base64src
	} from '@/common/util.js'
	import {
		getShareQRCode,
	} from '@/service/meet/index.js'

	export default {
		props: ['shareData', 'isControlTabbar'],
		data() {
			return {
				isShow: false,
				shareShow: false,
				totalWidth: 0.0,
				totalHeight: 0.0, //画布的高度
				canvasScale: 2.0, //
				imagePath: "",
				openSet: false,
				qrImg: '', //小程序自定义的二维码
				openSettingBtnHidden: false,
				imgIndex: 0,
			};
		},

		methods: {

			getCode() {
				uni.showLoading({

				})
				// if(this.qrImg && !this.isControlTabbar) {
				// 	this.beginDrawCanvans()
				// 	return
				// }
				getShareQRCode({
					url: this.shareData.shareInfo.path
				}).then(res => {
					console.log(res)
					this.qrImg = res
					this.beginDrawCanvans()
				}).catch(err => {

				})

			},

			show() {
				this.isShow = true
				this.showPosters()
			},
			miss() {
				if (this.isControlTabbar) {
					wx.showTabBar()
				}
				this.isShow = false
				
		
			},
			shareInfo(res) {

				this.miss()
				console.log(this.shareData)
				return {
					title: this.shareData.shareInfo.title,
					path: this.shareData.shareInfo.path,
					imageUrl: this.shareData.shareInfo.img
				}
			},
			selectTemplateImg(index) {

				this.imgIndex = index
				this.getCode()
			},
			showPosters() {
				// this.shareShow = true
				// this.miss()
				// if (this.imagePath) return

				if (!this.shareData) {

					uni.showToast({
						title: "未获取到活动相关信息",
						icon: 'none'
					})
					return
				}
				this.getCode()
			},
			beginDrawCanvans() {

				const systemInfo = uni.getSystemInfoSync()
				// const windowWidth = systemInfo.windowWidth
				const scale = systemInfo.windowWidth / 375.0
				const canvasScale = this.canvasScale
				console.log(scale)
				this.totalHeight = 350 * scale * canvasScale
				this.totalWidth = 250 * scale * canvasScale
				console.log(this.totalWidth)
				console.log(this.totalHeight)
				// 获取Canvas
				let ctx = uni.createCanvasContext('myCanvas', this)
				ctx.clearRect(0,0,this.totalWidth,this.totalHeight);//清除画布
				ctx.scale(this.canvasScale, this.canvasScale)
				//绘制主图背景
				roundRect(ctx, 0, 0, this.totalWidth, this.totalHeight, 6 * scale, '#ffffff')
				const goodsImageWidth = this.totalWidth / this.canvasScale
				const goodsImageHeight = this.totalHeight / this.canvasScale
				var that = this
				uni.getImageInfo({
					src: that.shareData.shareInfo.shareTemplateImages[this.imgIndex],
					success: function(res) {
						console.log(res.path)
						ctx.drawImage(res.path, 0, 0, goodsImageWidth, goodsImageHeight)
						ctx.setFillStyle('#ffffff')
						ctx.setFontSize(25 * scale)
						var nickNameWidth = 0;
						for (let i = 0; i < that.shareData.name.length; i++) {
							nickNameWidth += ctx.measureText(that.shareData.name[i]).width;
						}
						console.log(nickNameWidth)
						ctx.font = "normal bold 25px sans-serif"
						const topMargin = 60 * scale
						canvasTextAutoLine(that.shareData.name, ctx, (goodsImageWidth - nickNameWidth)/2, topMargin, 16 * scale, 220 * scale, 1)

						that.drawUserInfo(ctx, scale)
						// ctx.draw(false, () => {
						// 	setTimeout(() => {
						// 		that.canvasToTempImage()
						// 	}, 200);

						// })
					}
				})
			},
			drawUserInfo(ctx, scale) {

				var that = this
				uni.getImageInfo({
					src: that.shareData.photo,
					success: function(res) {
						console.log(res.path)
						ctx.save()
						ctx.beginPath()
						const userPhotoLeft = 77 * scale
						const userPhotoTop = 125 * scale
						const userImgSize = 29 * scale
						// 下面是先定位要开个圆形的位置,前面两个参数分别就是圆的圆心的 x 坐标和 y 坐标，后面的是 是半径，后面的两个参数就是起始和结束，这样就能画好一个圆了
						ctx.arc(userPhotoLeft + userImgSize / 2, userPhotoTop + userImgSize / 2, userImgSize / 2.0, 0, 2 * Math.PI)
						ctx.closePath()
						ctx.clip()
						ctx.drawImage(res.path, userPhotoLeft, userPhotoTop, userImgSize, userImgSize)
						ctx.restore()
						drawNormalText(ctx, that.shareData.nickName, 10 * scale + userPhotoLeft + userImgSize, userPhotoTop + 15 *
							scale, 12 * scale, '#ffffff', 'left', 'middle', scale)

						that.drawTimeInfo(ctx, scale)
					}
				})
			},

			drawTimeInfo(ctx, scale) {

				var that = this
				uni.getImageInfo({
					src: "https://image.famalltech.com/brandImg/e19ed6074ed06ed0573b6e997d9844c-19881648454097267.png?Expires=1963814097&OSSAccessKeyId=LTAIfEz63bW0rbAT&Signature=FaugTydKV%2FfQWQCcI6TZDrWXu0c%3D",
					success: function(res) {
						console.log(res.path)
						const userPhotoLeft = 10 * scale
						const userPhotoTop = 190 * scale
						const userImgSize = 14 * scale
						ctx.drawImage(res.path, userPhotoLeft, userPhotoTop, userImgSize, userImgSize)
						drawNormalText(ctx, `${that.shareData.startTime}~${that.shareData.endTime}`, 8 * scale + userPhotoLeft +
							userImgSize, userPhotoTop + 7 * scale, 12 * scale, '#ffffff', 'left', 'middle', scale)

						ctx.save()
						uni.getImageInfo({
							src: "https://image.famalltech.com/brandImg/87f241967a682e04ec30d0693cc8b2f-70261648454108049.png?Expires=1963814108&OSSAccessKeyId=LTAIfEz63bW0rbAT&Signature=qSl%2BXDes7i%2F5%2BW%2FLwHHK3lUwGA4%3D",
							success: function(tRes) {
								ctx.drawImage(tRes.path, userPhotoLeft, userPhotoTop + 20 * scale, userImgSize, userImgSize)
								canvasTextAutoLine(that.shareData.addressDetail, ctx, 8 * scale + userPhotoLeft + userImgSize, userPhotoTop +
									26 * scale, 15 * scale, 200 * scale, 2)
								// drawNormalText(ctx, that.shareData.addressDetail, 8 * scale + userPhotoLeft + userImgSize, userPhotoTop + 26 * scale, 12 * scale, '#ffffff', 'left', 'middle', scale)
								// drawNormalText(ctx, `报名时间: ${that.shareData.applyStartTime}~${that.shareData.applyEndTime}`,
									// userPhotoLeft, userPhotoTop + 60 * scale, 10 * scale, '#ffffff', 'left', 'middle', scale)
								// drawNormalText(ctx, `报名费用: ${that.shareData.feeAmount === '0' ? '免费':that.shareData.feeAmount}`,
								// 	userPhotoLeft, userPhotoTop + 80 * scale, 10 * scale, '#666666', 'left', 'middle', scale)

								that.drawQrCode(ctx, scale)
								// that.drawTimeInfo(ctx, scale)

							}
						})
					}
				})
			},

			drawQrCode(ctx, scale) {

				let qrImgSr = 'data:image/jpeg;base64,' + uni.arrayBufferToBase64(this.qrImg)
				console.log(qrImgSr)
				var that = this;
				const codeImgSize = 80 * scale
				const codeImgLeft = 10 * scale
				const codeImgTop = 260 * scale
				base64src(qrImgSr).then(res => {
				
					console.log(res, '23452362345')
					ctx.drawImage(res, codeImgLeft, codeImgTop, codeImgSize, codeImgSize)
					canvasTextAutoLine("长按图片，识别小程序查看详情", ctx, codeImgSize + 3 * codeImgLeft, codeImgTop + 25 * scale, 12 * scale,
						100 * scale, 2)
					ctx.save()
					uni.hideLoading()
					ctx.draw(false, () => {
						setTimeout(() => {
							that.canvasToTempImage()
						}, 200);

					})
				})
			},

			canvasToTempImage() {
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
			savePic() {
				//获取相册授权
				var that = this
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									//这里是用户同意授权后的回调
									that.saveImgToLocal()
								},
								fail() { //这里是用户拒绝授权后的回调
									that.openSettingBtnHidden = false
								}
							})
						} else { //用户已经授权过了
							that.saveImgToLocal()
						}
					}
				})
			},
			saveImgToLocal() {
				uni.saveImageToPhotosAlbum({
					filePath: this.imagePath,
					success: () => {
						uni.showToast({
							title: '保存成功',
							duration: 2000
						});
					},
					fail: () => {
						uni.showToast({
							title: '保存失败',
							duration: 2000,
							icon: "none"
						});
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.0);
		transition: 0.5s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.share_cancel {
			width: 48rpx;
			height: 48rpx;
		}

		.canvas_content {
			border-radius: 12rpx;
			position: fixed;
			top: 20rpx;
			left: 500%;
		}
	}

	.shareImg {
		width: 500rpx;
		height: 700rpx;
		background: #f5f5f5;
		border-radius: 12rpx;
		position: fixed;
		bottom: 580rpx;
		left: 125rpx;
		// z-index: 9999 !important;
	}

	.foot {

		.share_img_scroll {
			width: 100%;
			height: 200rpx;

			.share_img_list {
				height: 100%;
				display: inline-flex;
				padding: 0 30rpx;

				.share_img_item {
					width: 107rpx;
					height: 163rpx;
					margin-right: 25rpx;
					border-radius: 12rpx;

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}

		transition: 0.5s;
		height: 550rpx;
		position: fixed;
		left: 20rpx;
		right: 20rpx;
		bottom: -550rpx;
		z-index: 1;

		.share_top {
			height: 220rpx;
			background: #fff;
			border-radius: 12rpx;
			display: flex;

			button {
				background: #fff;
			}

			button::after {
				border: none;
			}

			.share_item {
				height: 100%;
				width: 50%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.share_img {
					width: 100rpx;
					height: 100rpx;
					margin-bottom: 15rpx;
				}

				.share_title {
					color: #333;
					font-size: 28rpx;
					line-height: 30rpx;
				}
			}
		}

		.cancel {
			margin-top: 10rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #333;
			font-size: 32rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
		}
	}

	.save {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #333;
		font-weight: bold;
		font-size: 30rpx;
		background: #fff;
	}
</style>
