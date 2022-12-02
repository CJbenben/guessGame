<template>
	<view class="container">
		<view class="bg_view_bottom">
			<text>{{itemData.title}}</text>
			<view class="item_red_ball" v-for="(item, i) in itemData.redNums" v-bind:key="i">
				<text class="red_number" >{{item}}</text>
			</view>
			<view class="item_blue_ball">
				<text class="blue_number" >{{itemData.blueNum}}</text>
			</view>
			<!-- <view class="scale">
				<text class="scale_title">AB组</text>
				<text class="scale_title">{{groupABscale}}</text>
			</view>
			<view class="scale">
				<text class="scale_title">AC组</text>
				<text class="scale_title">{{groupACscale}}</text>
			</view>
			<view class="scale">
				<text class="scale_title">BC组</text>
				<text class="scale_title">{{groupBCscale}}</text>
			</view> -->
		</view>
		<view class="line_view" />
	</view>
</template>

<script>
	export default {
		name: "guess-item-cell",
		props: {
			itemData: {},
			groupABscale: 0,
			groupACscale: 0,
			groupBCscale: 0,
		},
		data() {
			return {
				numbers: [1, 2, 3, 4, 5, 6]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.container {
		background-color: #f5f5f5;
		margin-left: 10rpx;
		margin-right: 10rpx;
	},
	.bg_view_title {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 50rpx;
		background-color: #fff;
	},
	.title {
		font-size: 30rpx;
		color: #333;
	},
	.time {
		padding-left: 20rpx;
		font-size: 24rpx;
		color: #666;
	},
	.bg_view_bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 50rpx;
		background-color: white;
		padding-top: 10rpx;
		padding-bottom: 20rpx;
	},
	.item_red_ball {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: red;
		height: 50rpx;
		width: 50rpx;
		margin-right: 10rpx;
		margin-left: 10rpx;
		border-radius: 25rpx;
	},
	.item_blue_ball {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: blue;
		height: 50rpx;
		width: 50rpx;
		margin-right: 10rpx;
		margin-left: 10rpx;
		border-radius: 25rpx;
	},
	.red_number {
		color: white;
		font-size: 34rpx;
	},
	.blue_number {
		color: white;
		font-size: 34rpx;
	},
	.scale {
		display: flex;
		flex-direction: column;
		padding-left: 5rpx;
		padding-right: 5rpx;
	},
	.scale_title {
		font-size: 26rpx;
	},
	.line_view {
		background-color: #ddd;
		height: 0.5rpx;
		margin-bottom: 20rpx;
	}
</style>
