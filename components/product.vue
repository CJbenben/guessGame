<template>
	<view class="product">
		<view class="product-image">
			<image @click="$Router.push({path: '/pages/productDetail/productDetail', query: {itemId: item.id}})"
			 :src="item.itemImg" class="product-img"></image>
			 <image @click="$Router.push({path: '/pages/productDetail/productDetail', query: {itemId: item.id}})" class="nostock" :src="nostockImg" v-if="item.stockDes === '售罄'"></image>
		</view>
		<view class="product_con">
			<view @click="$Router.push({path: '/pages/productDetail/productDetail', query: {itemId: item.id}})" class="product-title">{{item.name}}</view>
			<!-- <view class="product-price">
				<view class="left">
					<view class="mpPrice" v-if="showCard">{{item.ext1}} {{item.fpPrice}}</view>
					<view class="mpPrice" v-else>{{item.ext1}} {{item.mpPrice}}</view>
					<view class="mpPv" v-if="showCard">$PV {{item.fpPv}}</view>
					<view class="mpPv" v-else>$PV {{item.mpPv}}</view>
				</view>
				<view v-if="Number(item.freedomPrice) > Number(item.mpPrice)" class="freedomPrice"> {{item.ext1}} {{item.freedomPrice}}</view>
			</view> -->
			<view class="fanli">
				<!-- <view class="left" v-if="!showCard">
					
					{{$t('common.backPrice')}}：{{item.ext1}} {{item.ext2}}
				</view>
				<view v-else>	
				</view> -->
				<view class="price">
					<view class="skuPrice">¥{{item.skuPrice}}</view>
					<view class="originPrice">¥{{item.originPrice}}</view>
				</view>
				<image @click.stop="addCart" class="cart" src="@/static/home/cart.png" mode=""></image>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'product',
		props: ['item', 'showCard'],
		data() {
			return {
				nostockImg: '/static/product/nostock.png'
			}
		},
		created() {
			
		},
		methods: {
			
			addCart() {
				this.$emit('addCart',this.item)
			}
		}
	}
</script>

<style lang="less" scoped>
	.product {
		border-radius: 16rpx;
		overflow: hidden;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
	}

	.product-image {
		height: 346rpx;
		width: 100%;
		position: relative;
		.product-img {
			width: 100%;
			height: 100%;
		}
		.nostock {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
		}
	}
	
	.product_con {
		padding: 20rpx;
	}

	.product-title {
		height: 84rpx;
		width: 300rpx;
		font-size: 24rpx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		color: #333;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	// .product-price {
	// 	// display: flex;
	// 	// justify-content: space-between;
	// 	margin-top: 10rpx;
	// 	.left {
	// 		display: flex;
	// 		align-items: center;
	// 		justify-content: space-between;
	// 		.mpPrice {
				
	// 			font-size: 28rpx;
	// 			font-family: PingFang SC;
	// 			font-weight: bold;
	// 			color: #FB6A21;
	// 		}
	// 		.mpPv {
				
	// 			font-size: 26rpx;
	// 			font-family: PingFang SC;
	// 			font-weight: 400;
	// 			color: #666666;
	// 		}
	// 	}
	// 	.freedomPrice {
	// 		// margin-left: 10rpx;
	// 		font-size: 20rpx;
	// 		font-family: PingFang SC;
	// 		font-weight: 400;
	// 		text-decoration: line-through;
	// 		color: #999999;
	// 	}
		
	// }
	.fanli {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		// .left {
		// 	padding: 2rpx 10rpx;
		// 	border: 1rpx solid #FA2C49;
		// 	border-radius: 4rpx;
		// 	font-size: 18rpx;
		// 	font-family: PingFang SC;
		// 	font-weight: 400;
		// 	color: #FA2C49;
		// }
		.price {
			display: flex;
			align-items: center;
			.skuPrice {
				color: #EE1F2C;
				font-size: 28rpx;
			}
			.originPrice {
				color: #999;
				font-size: 22rpx;
				margin-left: 10rpx;
			}
		}
		.cart {
			width: 36rpx;
			height: 36rpx;
		}
	}

	
	.product-tip {
		position: absolute;
		right: 10rpx;
		background-color: #FF3333;
		color: #FFFFFF;
		padding: 0 10rpx;
		border-radius: 5rpx;
	}
</style>
