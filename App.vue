<script>
	// 双色球中奖号码数据
	import {ssqList} from "./static/ssqData.js"
	
	export default {
		globalData: {
			ssqList: ssqList,
			maxBlue: 16,
			maxRed: 33,
			groupA: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31],
			groupB: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32],
			groupC: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33],
			groupAB: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32],
			groupAC: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33],
			groupBC: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33],
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
