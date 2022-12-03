<template>
	<view class="content">
		<view class="">
			<view class="view-top">
				<button class="analyse" @click="nextAction">下一期预测</button>
			</view>
		</view>
		<scroll-view class="">
			<view class="" v-for="(item, i) in winningNumbers" v-bind:key="i">
				<item-cell :key="i" 
					:itemData="item"
					:showScale="false"
					@clickButton="clickRelease" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// import {ssqList} from "../../static/ssqData.js"
	// const maxBlue = 16;
	// const maxRed = 33;
	// var groupA = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31];
	// var groupB = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32];
	// var groupC = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33];
	// var groupAB = [];
	// var groupAC = [];
	// var groupBC = [];
	
	export default {
		data() {
			return {
				winningNumbers: getApp().globalData.ssqList,
				groupA: getApp().globalData.groupA,
				groupB: getApp().globalData.groupB,
				groupC: getApp().globalData.groupC,
				groupAB: getApp().globalData.groupAB,
				groupAC: getApp().globalData.groupAC,
				groupBC: getApp().globalData.groupBC,
			}
		},
		onLoad() {
			// test()
			// for (let i = 1; i<=maxRed; i++) {
			// 	if (i % 3 == 1) {
			// 		groupA.push(i)
			// 	} else if (i % 3 == 2) {
			// 		groupB.push(i)
			// 	} else {
			// 		groupC.push(i)
			// 	}
			// }
			// groupAB = this.groupA.concat(this.groupB)
			// groupAC = this.groupA.concat(this.groupC)
			// groupBC = this.groupB.concat(this.groupC)
	
			console.log('AB组='+this.groupAB);
			console.log('AC组='+this.groupAC);
			console.log('BC组='+this.groupBC);
			
		},
		methods: {
			nextAction() {
				uni.navigateTo({
					url: '/pages/Home/forecast'
				})
			},
			
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}
	.analyse {
		margin: auto 40rpx;
		height: 60rpx;
		background-color: #00aaff;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 60rpx;
		border-radius: 30rpx;
	}

	.view-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
