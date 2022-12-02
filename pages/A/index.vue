<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="">
			<view class="view-top">
				<button class="analyse" @click="nextAction">下一期预测</button>
				<button class="analyse" @click="analyseAction">计算比例</button>
			</view>
			<view class="" v-for="(item, i) in guessRedNums" v-bind:key="i">
				<guess-item-cell :key="i" :itemData="item" />
			</view>
		</view>
		<scroll-view class="">
			<view class="" v-for="(item, i) in winningNumbers" v-bind:key="i">
				<item-cell :key="i" 
					:itemData="item" 
					:groupABscale='groupABscale[i]'
					:groupACscale='groupACscale[i]'
					:groupBCscale='groupBCscale[i]'
					@clickButton="clickRelease" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {ssqList} from "../../static/ssqData.js"
	const maxBlue = 16;
	const maxRed = 33;
	var groupA = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31];
	var groupB = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32];
	var groupC = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33];
	var groupAB = [];
	var groupAC = [];
	var groupBC = [];
	
	export default {
		data() {
			return {
				winningNumbers: ssqList,
				nextBlueNum: 0,
				nextRedNums: [],
				groupABscale: [],//AB组中奖比例
				groupACscale: [],//AC组中奖比例
				groupBCscale: [],//BC组中奖比例
				guessRedNums: [],//预测红球
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
			groupAB = groupA.concat(groupB)
			groupAC = groupA.concat(groupC)
			groupBC = groupB.concat(groupC)
	
			console.log('AB组='+groupAB);
			console.log('AC组='+groupAC);
			console.log('BC组='+groupBC);
			
			this.guessRedNumsAction()
			
		},
		methods: {
			test() {
				// 存放随机生成红球数组
				var mathRedAry = []; 
				for (let i = 0; i<6; i++) {
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
			
			sortNumbers(a,b) {
			   return a-b;
			},
			
			nextAction() {
				this.guessRedNums = []
				this.guessRedNumsAction();
			},
			analyseAction() {
				console.log('AB组判断');
				
				//console.log('abdfa'+groupAB.includes(33));
				
				for (let i = 0; i<this.winningNumbers.length; i++) {
					let item = this.winningNumbers[i]
					//console.log('item'+item.redNums.length);
					var countAB = 0;
					var countAC = 0;
					var countBC = 0;
					for (let j = 0; j<item.redNums.length; j++) {
						//console.log('redNums[j]'+item.redNums[j]);
						if (groupAB.includes(item.redNums[j])) {
							countAB++
						}
						if (groupAC.includes(item.redNums[j])) {
							countAC++
						}
						if (groupBC.includes(item.redNums[j])) {
							countBC++
						}
					}
					let scaleAB = countAB*100/item.redNums.length;
					let scaleAC = countAC*100/item.redNums.length;
					let scaleBC = countBC*100/item.redNums.length;
					this.groupABscale.push(scaleAB.toFixed(0)+'%')
					this.groupACscale.push(scaleAC.toFixed(0)+'%')
					this.groupBCscale.push(scaleBC.toFixed(0)+'%')
				}
				console.log('AB组中奖比例'+this.groupABscale);
				//this.$Router.push("/pages/A/analysis")
			},
			
			// 随机红球
			guessRedNumsAction() {
				// AB组
				let arrayLength = groupAB.length
				var redNumbers = []
				for (let j = 0; j<6; j++) {
					let index = Math.floor(Math.random() * (arrayLength));
					if (redNumbers.includes(groupAB[index])) {
						j--;
					} else {
						redNumbers.push(groupAB[index])
					}
					//console.log(index+'######'+groupAB[index]);
				}
				
				console.log('------------------'+redNumbers.sort(this.sortNumbers));
				
				this.guessRedNums.push({"title": '第一组', 'redNums': redNumbers.sort(this.sortNumbers), 'blueNum': 10})
				
				console.log(this.guessRedNums);
				
				
				// AC组
				var redNumbersAC = []
				for (let j = 0; j<6; j++) {
					let index = Math.floor(Math.random() * (arrayLength));
					if (redNumbersAC.includes(groupAC[index])) {
						j--;
					} else {
						redNumbersAC.push(groupAC[index])
					}
				}
				
				this.guessRedNums.push({"title": '第二组', 'redNums': redNumbersAC.sort(this.sortNumbers), 'blueNum': 10})
				
				
				// BC组
				var redNumbersBC = []
				for (let j = 0; j<6; j++) {
					let index = Math.floor(Math.random() * (arrayLength));
					if (redNumbersBC.includes(groupBC[index])) {
						j--;
					} else {
						redNumbersBC.push(groupBC[index])
					}
				}
				
				this.guessRedNums.push({"title": '第三组', 'redNums': redNumbersBC.sort(this.sortNumbers), 'blueNum': 10})
				
				console.log(this.guessRedNums);
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		margin-left: 10rpx;
		margin-right: 10rpx;
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
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
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
