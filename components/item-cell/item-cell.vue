<template>
	<view>
		<view class="bg_view">
			<text class="blue_ball">1</text>
			<text class="blue_ball">2</text>
			<text class="blue_ball">3</text>
			<text class="blue_ball">4</text>
			<text class="blue_ball">5</text>
			<text class="blue_ball">6</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.bg_view {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 50rpx;
		background-color: antiquewhite;
	},
	.blue_ball {
		background-color: red;
		height: 50rpx;
		width: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: white;
		font-size: 34rpx;
		margin-right: 10rpx;
		margin-left: 10rpx;
		border-radius: 25rpx;
	}
</style>
