<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="">
			<view class="view-top">
				<button class="analyse" @click="nextAction">换一批</button>
				<!-- <button class="analyse" @click="analyseAction">计算比例</button> -->
			</view>
			<view class="" v-for="(item, i) in guessRedNums" v-bind:key="i">
				<guess-item-cell :key="i" :itemData="item" />
			</view>
		</view>
		<scroll-view class="">
			<view class="" v-for="(item, i) in winningNumbers" v-bind:key="i">
				<item-cell :key="i" 
					:itemData="item"
					:showScale="true"
					:groupABscale='groupABscale[i]'
					:groupACscale='groupACscale[i]'
					:groupBCscale='groupBCscale[i]'
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
				groupAB: getApp().globalData.groupAB,
				groupAC: getApp().globalData.groupAC,
				groupBC: getApp().globalData.groupBC,
				maxRed: getApp().globalData.maxRed,
				groupABscale: [],//AB组中奖比例
				groupACscale: [],//AC组中奖比例
				groupBCscale: [],//BC组中奖比例
				guessBlueNumCount: 3,// 默认生成3个蓝球数字
				guessAllBlueNums: [],//预测下一期可能出现的所有蓝球数组
				guessBlueNum: '',//最终预测的蓝球
				guessBlueNum2: '',//最终预测的蓝球（备选）
				
				guessRedNumCount: 24,// 默认生成24个红球数字
				guessAllRedNums: [],//预测下一期可能出现的所有红球数组
				guessRedNums: [],//最终预测的红球组合
			}
		},
		onLoad() {
			// console.log('AB组='+this.groupAB);
			// console.log('AC组='+this.groupAC);
			// console.log('BC组='+this.groupBC);
			// 预测下一期可能出现的所有红球数组
			this.guessAllRedBallAry()
			// 预测下一期号码
			this.guessNextNumsAction()
			// 各组历史中奖比例
			this.analyseAction()
		},
		methods: {
			// 换一批预测
			nextAction() {
				this.guessRedNums = []
				this.guessNextNumsAction();
			},
			
			// 随机下一次中奖号码
			guessNextNumsAction() {
				// 蓝球
				this.guessBlueBallNew();
				// 红球
				this.guessRedBall();
			},
			
			guessAllRedBallAry() {
				// 每个红球总共出现次数
				var redBallCountAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				this.winningNumbers.forEach((item, index) => {
					item.redNums.forEach((redNum, index) => {
						redBallCountAry[redNum-1]++;
					})
				});
				console.log(redBallCountAry);
				// 排序后每个红球出现次数
				var sortRedBallCountAry = redBallCountAry.sort(this.sortNumbers)
				console.log('sortRedBallCountAry = '+sortRedBallCountAry);
				
				/**
				 * 如果有多个相同低频率出现的红球，扩大取出红球个数
				 */
				let lastRedNum = sortRedBallCountAry[this.guessRedNumCount-1];
				while (lastRedNum == sortRedBallCountAry[this.guessRedNumCount]) {
					// 满足条件，往后移一位
					lastRedNum = sortRedBallCountAry[this.guessRedNumCount];
					this.guessRedNumCount++
				}
				console.log('guessRedNumCount = '+this.guessRedNumCount);
				
				// 未排序
				var noSortRedBallCountAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				this.winningNumbers.forEach((item, index) => {
					item.redNums.forEach((redNum, index) => {
						noSortRedBallCountAry[redNum-1]++;
					})
				});
				console.log('noSortRedBallCountAry = '+noSortRedBallCountAry);
				
				// 红球最低出现位置（位置就是出现最低次数的红球号码）
				for (let j = 0; j<this.guessRedNumCount; j++) {
					let sortRedNum = sortRedBallCountAry[j]
					for (let i = 0; i<noSortRedBallCountAry.length; i++) {
						let redBallNum = noSortRedBallCountAry[i];
						// 如果在原始未排序中找到需要的元素，取出原始未排序的下标，即蓝球号码 && 去重
						if ((sortRedNum == redBallNum) && !this.guessAllRedNums.includes((i+1))) {
							this.guessAllRedNums.push(i+1)
						}
					}
				}
				console.log('预计下一期所有红球号码组 = '+ this.guessAllRedNums);
			},
			
			// 私有方法：随机计算红球
			guessRedBall() {
				console.log('-----------------------随机计算红球');
				// 三组红球
				// AB组guessAllRedNums
				let arrayLength = this.groupAB.length
				var redNumbersAB = []
				for (let j = 0; j<6; j++) {
					let index = Math.floor(Math.random() * (arrayLength));
					// 去重
					if (redNumbersAB.includes(this.groupAB[index])) {
						j--;
					} else {
						// 如果是低频率出现的直接保存
						if (this.guessAllRedNums.includes(this.groupAB[index])) {
							redNumbersAB.push(this.groupAB[index])
						} else {
							console.log('#### = '+this.groupAB[index]);
							j--
						}
					}
					//console.log(index+'######'+groupAB[index]);
				}
				console.log('预计下一期红球号码AB组 = '+redNumbersAB.sort(this.sortNumbers));
				this.guessRedNums.push({"title": '第一组', 'redNums': redNumbersAB.sort(this.sortNumbers), 'blueNum': this.guessBlueNum})
				//console.log(this.guessRedNums);
				
				
				// AC组
				var redNumbersAC = []
				for (let j = 0; j<6; j++) {
					let index = Math.floor(Math.random() * (arrayLength));
					// 去重
					if (redNumbersAC.includes(this.groupAC[index])) {
						j--;
					} else {
						// 如果是低频率出现的直接保存
						if (this.guessAllRedNums.includes(this.groupAC[index])) {
							redNumbersAC.push(this.groupAC[index])
						} else {
							console.log('#### = '+this.groupAC[index]);
							j--
						}
					}
				}
				console.log('预计下一期红球号码AC组 = '+redNumbersAC.sort(this.sortNumbers));
				this.guessRedNums.push({"title": '第二组', 'redNums': redNumbersAC.sort(this.sortNumbers), 'blueNum': this.guessBlueNum})
				
				// BC组
				var redNumbersBC = []
				for (let j = 0; j<6; j++) {
					let index = Math.floor(Math.random() * (arrayLength));
					// 去重
					if (redNumbersBC.includes(this.groupBC[index])) {
						j--;
					} else {
						// 如果是低频率出现的直接保存
						if (this.guessAllRedNums.includes(this.groupBC[index])) {
							redNumbersBC.push(this.groupBC[index])
						} else {
							console.log('#### = '+this.groupBC[index]);
							j--
						}
					}
				}
				console.log('预计下一期红球号码BC组 = '+redNumbersBC.sort(this.sortNumbers));
				this.guessRedNums.push({"title": '第三组', 'redNums': redNumbersBC.sort(this.sortNumbers), 'blueNum': this.guessBlueNum2})
			},
			
			// 私有方法：随机计算蓝球（先计算出3个最低出现的频率，然后再算出最多期没有出现的号码）
			guessBlueBallNew() {
				console.log('-----------------------随机计算蓝球');
				// 所有中奖了的蓝球数组
				var allBlueNums = []
				// 每个蓝球总共出现次数
				var blueBallCountAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				this.winningNumbers.forEach((item, index) => {
					blueBallCountAry[item.blueNum-1]++;
					allBlueNums.push(item.blueNum)
				});
				//console.log(blueBallCountAry);
				// 排序后每个蓝球出现次数
				var sortBlueBallCountAry = blueBallCountAry.sort(this.sortNumbers)
				//console.log('sortBlueBallCountAry = '+sortBlueBallCountAry);
				
				/**
				 * 如果有多个相同低频率出现的蓝球，扩大取出蓝球个数
				 */
				let lastBlueNum = sortBlueBallCountAry[this.guessBlueNumCount-1];
				while (lastBlueNum == sortBlueBallCountAry[this.guessBlueNumCount]) {
					// 满足条件，往后移一位
					lastBlueNum = sortBlueBallCountAry[this.guessBlueNumCount];
					this.guessBlueNumCount++
				}
				//console.log('guessBlueNumCount = '+this.guessBlueNumCount);
				
				// 未排序
				var noSortBlueBallCountAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				this.winningNumbers.forEach((item, index) => {
					noSortBlueBallCountAry[item.blueNum-1]++;
				});
				//console.log('noSortBlueBallCountAry = '+noSortBlueBallCountAry);
				
				// 蓝球最低出现位置（位置就是出现最低次数的蓝球号码）
				for (let j = 0; j<this.guessBlueNumCount; j++) {
					let sortBlueNum = sortBlueBallCountAry[j]
					for (let i = 0; i<noSortBlueBallCountAry.length; i++) {
						let blueBallNum = noSortBlueBallCountAry[i];
						// 如果在原始未排序中找到需要的元素，取出原始未排序的下标，即蓝球号码 && 去重
						if ((sortBlueNum == blueBallNum) && !this.guessAllBlueNums.includes((i+1))) {
							this.guessAllBlueNums.push(i+1)
						}
					}
				}
				console.log('预计下一期蓝球号码组 = '+ this.guessAllBlueNums);
				
				
				// 最多期没有出现的号码
				var maxIndex = 0;
				for (let guessBlueNum of this.guessAllBlueNums) {
					let index = allBlueNums.indexOf(guessBlueNum);
					console.log('多少期未出现过 = '+ index);
					if (maxIndex < index) {
						maxIndex = index
						this.guessBlueNum = allBlueNums[index];
					}
				}
				console.log('最终预计下一期蓝球号码 = '+ this.guessBlueNum);
				
				
				// 倒数第二期没有出现的号码
				let index = this.guessAllBlueNums.indexOf(this.guessBlueNum)
				this.guessAllBlueNums.splice(index, 1)
				
				var maxIndex2 = 0;
				for (let guessBlueNum of this.guessAllBlueNums) {
					let index = allBlueNums.indexOf(guessBlueNum);
					//console.log('多少期未出现过 = '+ index);
					if (maxIndex2 < index) {
						maxIndex2 = index
						this.guessBlueNum2 = allBlueNums[index];
					}
				}
				console.log('最终预计下一期蓝球号码(备选) = '+ this.guessBlueNum2);
				
			},
			
			// 私有方法：随机计算蓝球(+ - 4算法，实际使用发现中奖率太低)
			guessBlueBall() {
				console.log('-----------------------随机计算蓝球');
				// 蓝球
				var blueHitCount = 0;
				for (let i = 0; i<this.winningNumbers.length-2; i++) {
					let firstItem = this.winningNumbers[i];
					let secondItem = this.winningNumbers[i+1]
					let thirdItem = this.winningNumbers[i+2]
					//console.log(firstItem.blueNum, secondItem.blueNum, thirdItem.blueNum)
					// 算法计算出最新一位篮球
					let guessFirstBlueNum = Math.abs(secondItem.blueNum - thirdItem.blueNum)
					if (firstItem.blueNum > guessFirstBlueNum - 4 &&
						firstItem.blueNum < guessFirstBlueNum + 4) {
						blueHitCount++
					}
				}
				//console.log(blueHitCount, this.winningNumbers.length-2)
				let blueHitScale = blueHitCount*100/(this.winningNumbers.length-2)
				let message = '+-4蓝球算法概率'+blueHitScale.toFixed(0)+'%'
				uni.showToast({
					title: message,
					icon: "none",
					duration: 2000,
				});
			},
			
			// 私有方法：计算中奖号码在各组命中比例
			analyseAction() {
				for (let item of this.winningNumbers) {
					var countAB = 0;
					var countAC = 0;
					var countBC = 0;
					for (let redNum of item.redNums) {
						if (this.groupAB.includes(redNum)) {
							countAB++
						}
						if (this.groupAC.includes(redNum)) {
							countAC++
						}
						if (this.groupBC.includes(redNum)) {
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
			},
			
			// 私有方法：排序
			sortNumbers(a,b) {
			   return a-b;
			},
			
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
