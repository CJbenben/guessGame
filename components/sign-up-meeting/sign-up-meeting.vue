<template>
	<view class="item_view" @click="clickItem">
		<view class="item_title">
			<text class="title">{{itemData.name}}</text>
			<text class="title_state"
				:style="{background:itemData.buttonBackColor, color:itemData.buttonCharColor}">{{itemData.mtStatus}}</text>
		</view>
		<u-icon class="text" :label="itemData.timeRange" label-size="24" label-color="#010101" size="26"
			margin-left="20" name="/static/meetingAdmin/icon_time.png" />
		<u-icon class="text" :label="itemData.addressDetail" label-size="24" label-color="#010101" size="26"
			margin-left="20" name="/static/meetingAdmin/icon_address.png" />
		<text class="number">浏览{{itemData.eyes}}&nbsp;&nbsp;&nbsp;&nbsp;报名{{itemData.register}}</text>
	</view>
</template>

<script>
	export default {
		name: "sign-up-meeting",
		props: {
			itemData: {}
		},
		data() {
			return {

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
		}
	}
</script>

<style scoped lang="scss">
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
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #010101;
		line-height: 36rpx;
	}

	.title_state {
		width: 102rpx;
		height: 36rpx;
		border-radius: 18rpx;
		font-size: 22rpx;
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
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #B6B6B6;
		line-height: 36rpx;
		margin: 8rpx 20rpx 20rpx 20rpx;
		text-align: end;
	}
</style>
