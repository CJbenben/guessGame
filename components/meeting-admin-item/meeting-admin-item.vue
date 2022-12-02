<template>
	<view class="item_view">
		<view style="background: #FFFFFF;padding: 30rpx 20rpx;border-radius: 12rpx;">
			<view style="display: flex; flex-direction: column;border-radius: 12rpx;box-shadow: 0rpx 6rpx 18rpx #e5e4e4;" @click="clickItem" :style="{background:itemData.buttonBackColor, color:itemData.buttonCharColor}">
					<view class="item_title">
						<text class="title">{{itemData.name}}</text>
						<!-- <text class="title_state"
							:style="{background:itemData.buttonBackColor, color:itemData.buttonCharColor}">{{itemData.mtStatus}}</text> -->
					</view>
				<u-icon class="text" :label="itemData.timeRange" label-size="26" label-color="#010101" size="26"
					margin-left="20" name="/static/meetingAdmin/icon_time.png" />
				<u-icon class="text" :label="itemData.addressDetail" label-size="26" label-color="#010101" size="26"
					margin-left="20" name="/static/meetingAdmin/icon_address.png" />
					
				<view class="item_info">
					<view class="item_info_left">
						<image class="item_info_left_img" src="https://image.famalltech.com/brandImg/%E4%BA%BA%E6%95%B0-30991648540894146.png?Expires=1963900894&OSSAccessKeyId=LTAIfEz63bW0rbAT&Signature=Fjo4pF7nu7oID38BjEeFtlOCc00%3D" mode=""></image>
						{{itemData.register}}/{{itemData.limitNum}}
					</view>
					<view :style="{color:itemData.buttonCharColor}" class="item_info_right">
						{{itemData.mtStatus}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="button" v-show="myactive">
			<view class="btn_icon" @click="clickButtons(index)" v-for="(item, index) in buttons" :key="index">
				<text :style="{color: item.color, fontSize: item.fontSize}" :class="item.icon"></text>
				<view class="btn_icon_text">
					{{item.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "meeting-admin-item",
		props: {
			itemData: {},
			index: 0,
			myactive: "",
		},
		data() {
			return {
				buttons: [{
						text: '报名名单',
						icon: 'iconfont icon-renyuanmingdan',
						color: '#00aaff',
						fontSize: '50rpx'
					},
					{
						text: '转发',
						icon: 'iconfont icon-fenxiang',
						color: '#00aaff',
						fontSize: '50rpx'
					},
					{
						text: '编辑',
						icon: 'iconfont icon-bianjiwenjian',
						color: '#00aaff',
						fontSize: '50rpx'
					},
					{
						text: '更多',
						icon: 'iconfont icon-gengduo',
						color: '#00aaff',
						fontSize: '50rpx'
					}
				]
			};
		},
		methods: {
			clickItem() {
				this.$Router.push({
					path: "/pages/tabBar/meetManager/meetDetail/meetDetail",
					query: {
						mtId: this.itemData.mtId
					}
				})
			},
			clickButtons(i) {
				let data = {
					position: i,
					index: this.index,
					itemData: this.itemData
				}
				this.$emit("clickButton", data)
			}
		}
	}
</script>

<style>
	.item_view {
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 20rpx;
		display: flex;
		flex-direction: column;
	}
	
	.item_title {
		width: 100%;
		height: 80rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 20rpx;
		margin-top: 12rpx;
	}
	
	.title {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 700;
		color: #282828;
		line-height: 36rpx;
	}
	
	.title_state {
		width: 102rpx;
		height: 36rpx;
		border-radius: 18rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 36rpx;
		text-align: center;
	}
	

	.text {
		font-family: PingFang SC;
		font-weight: 500;
		margin: 12rpx 20rpx;
		line-height: 24px;
	}

	.number {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #B6B6B6;
		line-height: 36rpx;
		margin: 8rpx 20rpx 20rpx 20rpx;
		text-align: end;
	}

	.button {
		border-top: 2rpx solid #e8e8e8;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 12rpx 16rpx;
		text-align: center;
		
	}
	.btn_icon_text {
		font-size: 26rpx;
		margin-top: 10rpx;
		color: #00aaff;
	}

	.btn_icon {
		margin: 20rpx 0;
		width: 25%;
		justify-content: center;
	}
	
	.item_info {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.item_info_left_img {
		width: 30rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}
	
	.item_info_left {
		font-size: 24rpx;
		color: #CCCCCC;
	}
	
	.item_info_right {
		font-size: 24rpx;
		color: #00aaff;
	}
</style>
