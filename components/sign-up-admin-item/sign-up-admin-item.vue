<template>
	<view class="item_view">
		<view class="item_title">
			<u-image width="78" height="78" :src="itemData.photo" shape="circle" />
			<view class="" style="flex: 1;">
				<view class="headerLine" style="justify-content: space-between;">
					<view style="display: flex; flex-direction: row; align-items: center;">
						<text class="title_name">{{itemData.nickName}}</text>
						<text class="title_date">{{itemData.createTime}}</text>
					</view>

					<text class="title_state"
						:style="{background:itemData.buttonBackColor, color:itemData.buttonCharColor}">{{itemData.desc}}</text>
				</view>
				<view style="display: flex; flex-direction: row; align-items: center;justify-content: space-between;">
					<view>
						<view class="headerLine">
							<view :style="{color: '#00aaff', fontSize: '30rpx', marginRight: '10rpx'}"
								class="iconfont icon-shouji"></view>
							<text class="title_date">{{itemData.meetingUserContentResDtos[1].value}}</text>
							<text class="title_date"
								style="margin-left: 10rpx;">{{itemData.meetingUserContentResDtos[0].value}}</text>
						</view>
						<!-- <view class="headerLine">
							<view style="display: flex; flex-direction: row; align-items: center;">
								<text class="signup_title">{{itemData.feeTitle}}</text>
								<text class="signup_text">{{itemData.feeSubTitle}}x{{itemData.num}}</text>
							</view>
						</view> -->
					</view>

					<image style="width: 60rpx;height: 60rpx;margin-right: 30rpx;" src="../../static/phone.png" mode="" @click="callPhone(itemData.meetingUserContentResDtos[1].value)" ></image>

				</view>

			</view>



		</view>
		<!-- <u-gap height="1" bg-color="#E6E6E6" />
		<view style="padding: 0rpx 30rpx;">
			<view class="item_line item_cost">
				<text class="cost_title">{{itemData.feeTitle}}</text>
				<text class="cost_text">{{itemData.feeSubTitle}}x{{itemData.num}}</text>
				<text class="cost_past">{{itemData.paidMoney}}</text>
			</view>
			<view v-for="(item, index) in itemData.meetingUserContentResDtos" :key="index">
				<u-gap height="1" bg-color="#E6E6E6" />
				<view class="item_line">
					<text class="title">{{item.title}}</text>
					<text class="text">{{item.value}}</text>
				</view>
			</view>
			<u-gap height="1" bg-color="#E6E6E6" v-if="itemData.operationList.length > 0"/>
			<view class="item_line item_button" v-if="itemData.operationList.length > 0">
				<u-button :custom-style="buttonStyle" shape="circle" :plain="true" hover-class="none"
					v-for="(item, index) in itemData.operationList" :key="index" @click="clickButtons(item.type)">
					{{item.title}}
				</u-button>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: "sign-up-admin-item",
		props: {
			itemData: {}
		},
		data() {
			return {
				buttonStyle: {
					color: '#666666',
					width: '180rpx',
					height: '56rpx',
					marginLeft: '30rpx'
				}
			};
		},
		methods: {
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone 
				});
			},
			clickButtons(type) {
				let btnData = {
					type: type,
					itemData: this.itemData
				}

				console.log(btnData, 'btnData')
				const that = this
				uni.showModal({
					title: '提示',
					content: '请确认是否' + this.itemData.operationList.find(item => item.type === type).title,
					success: function(res) {
						if (res.confirm) {
							that.$emit("clickButton", btnData)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			}
		}
	}
</script>

<style>
	.headerLine {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10rpx 10rpx 10rpx 30rpx;
	}

	.bottomLine {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.item_view {
		background: #FFFFFF;
		box-shadow: 0px 0px 12px 0px rgba(0, 170, 255, 0.2);
		border-radius: 8px;
		margin: 30rpx 30rpx;
	}

	.item_title {
		padding: 20rpx 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0rpx 30rpx;
	}

	.title_name {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		line-height: 36rpx;
		margin: 0rpx 20rpx 0rpx 0rpx;
	}

	.title_date {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
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

	.item_line {
		height: 88rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.cost_title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		line-height: 36rpx;
	}

	.cost_text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
		margin: 0rpx 26rpx 0rpx 10rpx;
	}

	.cost_past {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #179D41;
		line-height: 36rpx;
	}

	.title {
		width: 150rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		line-height: 36rpx;
	}

	.text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
	}

	.item_button {
		height: 112rpx;
		justify-content: flex-end;
	}
</style>
