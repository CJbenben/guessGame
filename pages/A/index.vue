<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="text-area">
			<text class="title">下一个</text>
		</view>
		<scroll-view class="">
			<view class="" v-for="(item, i) in winningNumbers" v-bind:key="i">
				<item-cell :key="i" :itemData="item" @clickButton="clickRelease" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {ssqList} from "../../static/ssqData.js"
	const maxBlue = 16;
	const maxRed = 33;
	
	export default {
		data() {
			return {
				winningNumbers: ssqList,
				nextBlueNum: 0,
				nextRedNums: []
			}
		},
		onLoad() {
			// 存放随机生成红球数组
			var mathRedAry = []; 
			for (let i = 0; i<116; i++) {
				let mathBlue = Math.floor(Math.random() * (maxRed)) + 1;
				
				console.log(mathBlue);;
			}
			
			// console.log(this.winningNumbers);
			// 篮球总共出现次数
			var blueBallCount = {};
			this.winningNumbers.forEach((item, index) => {
				const element = item.blueNum;
				if (blueBallCount[element]) {
					blueBallCount[element]++
				} else {
					blueBallCount[element] = 1;
				}
			});
			console.log(11111);
			console.log(blueBallCount);
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		margin-left: 15rpx;
		margin-right: 15rpx;
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
		/* justify-content: center; */
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
