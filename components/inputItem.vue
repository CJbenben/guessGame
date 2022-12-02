<template>
	<view class="inputComponent">
		<view class="input_label">
			{{label}}
		</view>
		<view class="input_input">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'inputItem',
		props: ['label']
	}
</script>

<style lang="less">
	.inputComponent {
		
		height: 100rpx;
		// line-height: 100rpx;
		margin: 0 20rpx;
		
		display: flex;
		align-items: center;
		.input_label {
			width: 160rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #333333;
		}

		.input_input {
			flex: 1;
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
		}
	}
</style>
