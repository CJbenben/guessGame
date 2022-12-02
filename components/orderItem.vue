<template>
	<view class="productItem">
		<image :src="item.imageUrl" class="productItem_img">

		</image>
		<view class="productItem_info">
			<view class="productItem_info_name">
				{{item.itemName}}
			</view>
			<view class="productItem_info_property">
				{{item.property}}
			</view>
			<view class="productItem_price">
				<view class="productItem_price_value">
					￥ {{item.priceDto.skuPrice}}
				</view>
				<view class="productItem_price_text">
					x{{item.quantity}}
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "orderItem",
		props: ['item', 'currency']
	}
</script>

<style lang="less">
	.productItem {
		margin: 20rpx;
		display: flex;

		.productItem_img {
			width: 180rpx;
			height: 180rpx;
			background: #F5F5F5;
		}

		.productItem_info {
			margin-left: 16rpx;
		
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.productItem_info_name {
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			
			.productItem_info_property{
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #666666;
			}

			.productItem_price {
				display: flex;
				justify-content: space-between;
				
				text-align: right;

				.productItem_price_value {
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #333333;
				}

				.productItem_price_text {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #999999;
				}
			}

		}

	}
</style>
