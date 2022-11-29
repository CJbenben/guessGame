<template>
	<view class="content">
<!-- 		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view> -->
		<scroll-view class="">
			<view class="" v-for="(item, i) in winningNumbers" v-bind:key="i">
				<item-cell :key="i" :itemData="item"
					@clickButton="clickRelease" />
					<view @click="copyMeeting(item)" class="" style="text-align: center;color: #ffffff;margin: 0 auto 60rpx auto;background: #3a9efc;width: 600rpx;border-radius: 50rpx;padding: 20rpx;">
						点击购买
					</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'A',
				winningNumbers: [1,2,3,4,5,6,7,8,9,10]
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
