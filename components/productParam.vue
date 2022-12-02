<template>
	<view>
		<view class="mask_contain" :hidden="!isShow">
		</view>
		<view class="mask_content" :style="{transform:isShow? 'translateY(-106%)':'translateY(0)'}">
			<image class="cancel" @click="visable(false)" src="/static/product/cacel.png"></image>
			<view class="goods-data">
				<image class="img" :src="selectImage" @click="showGoodsImage(selectImage)"></image>
				<view class="goods-right">
					<view class="price-pv">
						<!-- <text class="price" v-if="optionsData.prepareSaleResDto" style="color: #1A1A1A;margin-right: 10rpx">预付</text>
						<text class="price" v-if="optionsData.prepareSaleResDto">¥{{optionsData.prepareSaleResDto.depositPrice}}</text> -->
						<text class="price">¥{{selectPrice}}</text>
						<!-- <text class="pv" v-if="selectSkuUnit.priceDto.pv && selectSkuUnit.priceDto.pv !== 0">积分:{{selectSkuUnit.priceDto.pv}}</text> -->
					</view>
					<text class="holder" v-if="selectSkuItem !== '' && !optionsData.prepareSaleResDto">库存:{{selectSkuItem == undefined? '售罄':selectSkuItem.skuSaleUnitResDtoList[0].quantityCode == 0?'库存紧张':selectSkuItem.skuSaleUnitResDtoList[0].quantityCode == 1?'库存充足':'售罄'}}</text>
					<text class="holder">{{selectSkuStyle}}</text>
				</view>
			</view>
			<scroll-view scroll-y class="param-content">
				<view class="content">
					<view class="param" v-for="(item, index) in propertyResDtoList" :key="item.id">
						<text class="type">{{item.name}}</text>
						<view class="type-content">
							<view :class="eItem.selectType === 1 ? 'itemSelect': eItem.selectType === 2 ?'item':'itemDeselect'" @click="selectItemAction(eItem)"
							 v-for="(eItem, index) in item.listData" :key="eItem.id">{{eItem.propertyValue}}</view>
						</view>
					</view>
				</view>
				<view class="param">
					<view class="type">
						<text>数量</text>
						<!-- <text class="minOrder" v-if="optionsData.minOrder">{{optionsData.minOrder}}</text> -->
					</view>
					<view class='select-num-view'>
						<view class='increase' @click='decrease(item)'>-</view>
						<input type='number' :value='selectCount' @blur='editGoodsNumConfirm' maxlength="3" :disabled="!selectSkuUnit"></input>
						<view class='decrease' @click='increase(item)'>+</view>
					</view>
				</view>
			</scroll-view>
			<view class="goods-action">
				<view class="addCart" @click="addCart">加入购物车</view>
				<view class="buy" @click="buy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		cartAdd
	} from '@/service/cart/index.js'
	export default {
		// props: {
		// 	optionsData: {
		// 		type: JSON,
		// 		value: {}
		// 	},
		// },
		props: ['optionsData'],

		data() {
			return {
				detailData: null,
				isShow: false, //是否展示
				propertyResDtoList: [], //属性列表
				propertyDetailResDtoList: [], //属性值列表
				skuResDtoList: [], //是否有库存判断
				selectPropertys: [], //筛选的props
				itemSaleUnitResDto: {
					unitName: '',
					skuSaleUnitResDtoList: []
				}, //销售单位
				selectCount: 1,
				selectSkuItem: null,
				selectSkuUnit: null, //选中的销售单位的index
				selectSkuStyle: "请选择属性规格", //选中的规格汉字
				selectPrice: '',
				selectImage: '',
			};
		},
		methods: {

			visable() {
				this.isShow = !this.isShow
			},

			/* 传入初始值 */
			getOptionsData(optionsData) {

				if (!optionsData) {
					return
				}
				for (var aaa in optionsData.propertyResDtoList) {

					var resDto = optionsData.propertyResDtoList[aaa];
					var listData = [];
					for (var bbb in optionsData.propertyDetailResDtoList) {

						var item = optionsData.propertyDetailResDtoList[bbb];
						if (optionsData.propertyDetailResDtoList.length === 1 && optionsData.skuResDtoList.length === 1) {

							item.selectType = 1
							this.selectSkuItem = optionsData.skuResDtoList[0]
							this.selectPrice = optionsData.skuResDtoList[0].priceDto.skuPrice
							this.selectImage = optionsData.skuResDtoList[0].mediaInfoList.length ? optionsData.skuResDtoList[0].mediaInfoList[
								0].url : ''
							this.selectSkuStyle = optionsData.propertyDetailResDtoList[0].propertyValue

						} else {

							var price = optionsData.minPrice
							if (optionsData.minPrice !== optionsData.maxPrice) price = optionsData.minPrice + '-' + optionsData.maxPrice
							this.selectPrice = price
							this.selectImage = optionsData.mediaList.length ? optionsData.mediaList[0].url : ''
							item.selectType = 2;
						}
						if (item.propertyId === resDto.id) {

							listData.push(item);
						}
					}
					resDto.listData = listData;
				}

				optionsData.itemSaleUnitResDto.skuSaleUnitResDtoList.forEach(item => {

					item.selectType = 2;
				});

				var selects = []; //有规格的sku
				optionsData.skuResDtoList.forEach(item => {

					var listArray = [];
					item.propertyDetailResDtoList.forEach(props => {

						listArray.push(props.propertyValue);
					})
					selects.push(listArray);
				})

				console.log(selects);
				if (selects.length === 0) {

					optionsData.propertyResDtoList.forEach(item => {

						item.listData.forEach(seleItem => {

							seleItem.selectType = 3;
						})
					})

				} else if (selects[0].length === 1 && optionsData.propertyResDtoList.length === 1) {

					const indexArray = selects.map(seItem => {

						return seItem[0];
					})
					console.log(indexArray);
					optionsData.propertyResDtoList[0].listData.forEach(item => {

						const index = indexArray.indexOf(item.propertyValue);
						if (item.selectType !== 1) {

							if (index !== -1) {

								item.selectType = 2;
							} else {
								item.selectType = 3;
							}
						}

					});
				} else {

					optionsData.propertyResDtoList.forEach(proItem => {

						const findItem = 0;
						proItem.listData.forEach(listItem => {

							listItem.selectType = 3;
							selects.forEach(selectItem => {

								const fff = selectItem.find(fItem => {

									return listItem.propertyValue === fItem;
								})
								if (fff !== undefined) {
									listItem.selectType = 2;
								}
							})
						})
					})

				}

				if (optionsData.skuResDtoList.length > 1 || (optionsData.propertyDetailResDtoList.length > 1 && optionsData.skuResDtoList
						.length === 1)) {

					//需要自己选择, 为''不显示
					this.selectSkuItem = ""
				}
				this.propertyResDtoList = optionsData.propertyResDtoList
				this.skuResDtoList = optionsData.skuResDtoList
				this.itemSaleUnitResDto = optionsData.itemSaleUnitResDto
				this.selectPropertys = selects
				this.selectCount = 1
				this.preparePriceNum = optionsData.prepareSaleResDto ? optionsData.prepareSaleResDto.presellShowString +
					optionsData.prepareSaleResDto.presellBalanceShowString : null

				console.log(this.propertyResDtoList)
				if (optionsData.skuResDtoList.length === 1 && optionsData.propertyDetailResDtoList.length === 1) {

					var selectSkuUnit = undefined;
					optionsData.skuResDtoList[0].skuSaleUnitResDtoList.forEach(item => {

						if (item.baseUnit === true) {
							selectSkuUnit = item
							this.selectSkuUnit = selectSkuUnit
						}
					})

					this.selectSkuAllready(true);
				}
			},
			showGoodsImage(selectImage){
				this.selectImage = this.optionsData.mediaList.length ? this.optionsData.mediaList[0].url : ''
				// 预览图片
				uni.previewImage({
					urls:[selectImage]
				})
			},
			selectItemAction(item) {

				// const {
				// 	optionsData,
				// 	propertyResDtoList,
				// 	itemSaleUnitResDto,
				// 	selectPropertys
				// } = this.data;

				var selects = []; //有规格的sku
				console.log()
				this.optionsData.skuResDtoList.forEach(item => {

					var listArray = [];
					item.propertyDetailResDtoList.forEach(props => {

						listArray.push(props.propertyValue);
					})
					selects.push(listArray);
				})

				console.log(selects)
				this.propertyResDtoList.forEach(proItem => {

					const findItem = 0;
					proItem.listData.forEach(listItem => {

						selects.forEach(selectItem => {

							const fff = selectItem.find(fItem => {

								return listItem.propertyValue === fItem;
							})
							if (fff !== undefined) {
								if (listItem.selectType === 3) {
									listItem.selectType = 2;
								}
							}
						})
					})
				})

				console.log(this.selectPropertys)
				console.log(item)
				// const item = e.currentTarget.dataset.item;
				if (item.selectType === 3) {
					//不可选择状态
					return;
				}
				if (item.selectType === 1) {
					item.selectType = 2;
				} else {
					item.selectType = 1;
				}
				this.propertyResDtoList.forEach((propertyItem, index) => {
					if (item.propertyId === propertyItem.id) {
						console.log(propertyItem)
						propertyItem.listData.forEach(nextItem => {
							if (nextItem.id === item.id) {
								nextItem.selectType = item.selectType;

								if (nextItem.selectType === 1) {

									propertyItem.selectProperty = {

										data: nextItem.propertyValue,
										index: index
									}
								} else {
									propertyItem.selectProperty = undefined;
								}
							} else {
								if (nextItem.selectType === 1) {
									nextItem.selectType = 2;
								} else {

								}
							}
						})
					}
				})

				//获取用户选择的规格
				const userSelects = [];
				this.propertyResDtoList.forEach(propertyItem => {

					if (propertyItem.selectProperty !== undefined) {

						userSelects.push(propertyItem.selectProperty);
					}
				});
				console.log(userSelects);
				this.propertyResDtoList.forEach((propertyItem, tempIndex) => {

					var selectPro = [];
					//找到与之无关的选择项进行筛选
					userSelects.forEach(dataItem => {
						if (dataItem.index !== tempIndex) {
							selectPro.push(dataItem);
						}
					})
					console.log(selectPro);
					//开始循环遍历 找到有规格的和没有规格的
					var haveProps = [];
					this.selectPropertys.forEach(selecProps => {
						var isHave = true;
						if (selectPro.length === 0) {
							isHave = false;
						} else {
							selectPro.forEach(dddd => {

								if (selecProps[dddd.index] !== dddd.data) {
									isHave = false;
								} else {
									console.log(selecProps);
								}
							})
						}
						if (isHave && haveProps.indexOf(selecProps[tempIndex]) === -1) {

							haveProps.push(selecProps[tempIndex]);
						}
					})
					console.log(haveProps);
					propertyItem.listData.forEach(pItem => {

						if (haveProps.length > 0) {

							if (pItem.selectType === 1) {

							} else if (haveProps.indexOf(pItem.propertyValue) !== -1) {

								pItem.selectType = 2;
							} else {

								pItem.selectType = 3;
							}
						} else {

						}
					})
				});

				//判断sku有没有确定
				this.judgeUnitSkuVisible();
				this.propertyResDtoList = this.propertyResDtoList
				this.itemSaleUnitResDto = this.itemSaleUnitResDto
				// this.setData({

				// 	propertyResDtoList: propertyResDtoList,
				// 	itemSaleUnitResDto: itemSaleUnitResDto,
				// });
			},
			judgeUnitSkuVisible() {

				// const {
				// 	optionsData,
				// 	propertyResDtoList,
				// 	skuResDtoList,
				// 	itemSaleUnitResDto,
				// 	selectPropertys
				// } = this.data;
				var selectReDto = [];
				console.log(this.propertyResDtoList);
				this.propertyResDtoList.forEach(props => {

					if (props.selectProperty !== undefined) {

						selectReDto.push(props.selectProperty.data);
					}
				})
				console.log(selectReDto);
				console.log(this.propertyResDtoList);
				if (selectReDto.length === this.propertyResDtoList.length) {

					var selectIndex = undefined;
					this.selectPropertys.forEach((props, index) => {
						if (JSON.stringify(props) === JSON.stringify(selectReDto)) {
							selectIndex = index;
						}
					})
					const selectSkuItem = this.skuResDtoList[selectIndex];
					console.log(selectIndex)
					console.log(selectSkuItem);
					this.itemSaleUnitResDto.skuSaleUnitResDtoList.forEach((skuItem, index) => {

						const tempSku = selectSkuItem.skuSaleUnitResDtoList[index];
						if (tempSku === undefined || tempSku.quantityCode === '-1') {

							skuItem.selectType = 3;
						} else {
							skuItem.selectType = 2;
						}
						if (tempSku.baseUnit === true) {

							// this.setData({
							// 	selectSkuUnit: tempSku
							// })
							this.selectSkuUnit = tempSku
						}
					})

					// this.setData({

					// 	selectSkuItem: selectSkuItem,
					// 	itemSaleUnitResDto: itemSaleUnitResDto,
					// 	selectSkuStyle: selectReDto.join(' '),
					// 	selectPrice: selectSkuItem.priceResDto.skuPrice,
					// 	selectImage: selectSkuItem.mediaInfoList.length ? selectSkuItem.mediaInfoList[0].url : '',
					// })
					this.selectSkuItem = selectSkuItem
					this.itemSaleUnitResDto = this.itemSaleUnitResDto
					this.selectSkuStyle = selectReDto.join(' ')
					this.selectPrice = selectSkuItem.priceDto.skuPrice
					this.selectImage = selectSkuItem.mediaInfoList.length ? selectSkuItem.mediaInfoList[0].url : ''
					console.log(111);
					this.selectSkuAllready(true);
				} else {

					console.log(222);
					this.selectSkuAllready(false);
					this.itemSaleUnitResDto.skuSaleUnitResDtoList.forEach(skuItem => {

						skuItem.selectType = 2;
					})
					// this.setData({
					// 	selectSkuItem: '',
					// 	itemSaleUnitResDto: itemSaleUnitResDto,
					// 	selectSkuStyle: "请选择属性规格",
					// 	selectSkuUnit: ''
					// })
					this.selectSkuItem = ""
					this.itemSaleUnitResDto = this.itemSaleUnitResDto
					this.selectSkuStyle = "请选择属性规格"
					this.selectSkuUnit = ""

					var price = this.optionsData.minPrice;
					if (this.optionsData.minPrice !== this.optionsData.maxPrice) price = this.optionsData.minPrice + '-' + this.optionsData
						.maxPrice;
					// this.setData({

					// 	selectPrice: price,
					// 	selectImage: optionsData.mediaList.length ? optionsData.mediaList[0].url : '',
					// })
					this.selectPrice = price
					this.selectImage = this.optionsData.mediaList.length ? this.optionsData.mediaList[0].url : ''
				}
			},
			selectSkuAllready(isHave) {

				if (isHave) {
					uni.$emit("selectSkuAllready", {

						selectCount: this.selectCount,
						selectSkuStyle: this.selectSkuStyle,
						selectSkuItem: this.selectSkuItem,
						selectSkuUnit: this.selectSkuUnit
					})
				} else {

					uni.$emit('selectSkuAllready');
				}
				// const { selectCount, selectSkuStyle, selectSkuItem, selectSkuUnit } = this.data;
				// if (isHave) {

				// this.triggerEvent('selectSkuAllready', {

				// 	selectCount: selectCount,
				// 	selectSkuStyle: selectSkuStyle,
				// 	selectSkuItem: selectSkuItem,
				// 	selectSkuUnit: selectSkuUnit
				// });
				// } else {

				// 	this.triggerEvent('selectSkuAllready');
				// }
			},
			editGoodsNumConfirm(e) {

				if (!this.selectSkuUnit) {
					return
				}
				this.selectCount = e.detail.value
				this.selectSkuAllready(true);
			},
			decrease(item) {
				if (!this.selectSkuUnit) {
					return
				}
				if (this.selectCount === 1) {
					return
				}
				this.selectCount--
				this.selectCount = this.selectCount
				this.selectSkuAllready(true)
			},
			increase(item) {
				if (!this.selectSkuUnit) {
					return
				}
				this.selectCount++;
				this.selectCount = this.selectCount
				this.selectSkuAllready(true);
			},
			addCart() {
				
				const token = uni.getStorageSync('token')
				if(!token) {
					
					this.$Router.push('/pages/login/login')
					return
				}

				if (this.optionsData.skuResDtoList.length === 0) {

					uni.showToast({
						title: '该商品已售罄',
						icon: 'none',
					})
					return
				}
				if (!this.selectSkuUnit) {
					uni.showToast({
						title: '请选择规格',
						icon: 'none',
					})
					return
				}

				console.log(this.selectSkuUnit)
				console.log(this.selectSkuItem)
				cartAdd({
					skuId: this.selectSkuItem.id,
					quantity: this.selectCount,
					packingUnit: this.selectSkuUnit.id,
				}).then(res => {
					uni.$emit("updateCartNum", {
						quantity: this.selectCount,
					}),
					
					uni.showToast({
						title: "加入购物车成功!"
					})
				}).catch(err => {

				})
			},
			buy() {
				
				const token = uni.getStorageSync('token')
				if(!token) {
					
					this.$Router.push('/pages/login/login')
					return
				}

				this.$Router.push({
					name: 'confirmOrder',
					params: {
						'orderLists': [{
							skuId: this.selectSkuItem.id,
							quantity: this.selectCount,
							packingUnit: this.selectSkuUnit.id,
						}]
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.mask_contain {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 1;
	}

	.mask_content {
		bottom: -80%;
		transition: 0.5s;
		height: 75%;
		position: fixed;
		background: white;
		left: 0;
		width: 100%;
		border-radius: 5rpx 5rpx 0 0;
		z-index: 3;

		.cancel {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			/* color: #858585; */
			/* font-size: 48rpx; */
			width: 42rpx;
			height: 42rpx;
		}

		.goods-data {
			display: flex;

			.img {
				margin-left: 30rpx;
				margin-top: -30rpx;
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
				background: #f5f5f5;
			}

			.goods-right {

				display: flex;
				/* margin-top: 105rpx; */
				margin-left: 15rpx;
				flex-direction: column;
				position: relative;
				height: 170rpx;
				justify-content: flex-end;

				.price-pv {

					display: flex;
					align-items: center;

					.price {

						font-size: 24rpx;
						color: #CC0018;
					}

					.pv {

						font-size: 24rpx;
						color: #666;
						margin-left: 10rpx;
					}
				}

				.holder {

					font-size: 22rpx;
					color: #2C2C2C;
					margin-top: 5rpx;
				}
			}
		}

		.param-content {
			margin-top: 20rpx;
			margin-bottom: 90rpx;
			height: 65%;

			.content {

				display: inline-flex;
				flex-direction: column;
				width: 100%;
			}

			.param {

				margin-top: 40rpx;
				font-size: 24rpx;
				color: #2C2C2C;
				margin-left: 44rpx;
				margin-right: 44rpx;
				display: flex;
				flex-direction: column;

				.type-content {

					display: flex;
					flex-wrap: wrap;

					.item {

						padding-left: 20rpx;
						padding-right: 20rpx;
						font-size: 24rpx;
						color: #333333;
						height: 50rpx;
						line-height: 50rpx;
						border-radius: 6rpx;
						margin-right: 15rpx;
						margin-top: 20rpx;
						border: 1px solid #F5F5F5;
						background: #F5F5F5;
					}

					.itemSelect {

						padding-left: 20rpx;
						padding-right: 20rpx;
						font-size: 24rpx;
						color: #CC0018;
						height: 50rpx;
						line-height: 50rpx;
						border-radius: 6rpx;
						margin-right: 15rpx;
						margin-top: 20rpx;
						border: 1px solid #CC0018;
						background: #FFFCFC;
					}

					.itemDeselect {

						padding-left: 20rpx;
						padding-right: 20rpx;
						font-size: 24rpx;
						color: #ccc;
						height: 50rpx;
						line-height: 50rpx;
						border-radius: 6rpx;
						margin-right: 15rpx;
						margin-top: 20rpx;
						border: 1px solid #F5F5F5;
						background: #F5F5F5;
					}
				}

				.select-num-view {

					display: inline-flex;
					flex-direction: row;
					height: 55rpx;
					border: 1rpx solid #DCDCDC;
					border-radius: 30rpx;
					overflow: hidden;
					margin-top: 20rpx;
					max-width: 180rpx;
					margin-bottom: 30rpx;

					view {

						width: 50rpx;
						height: 50rpx;
						background: white;
						text-align: center;
						line-height: 55rpx;
						border: none;
						color: #666;
					}

					input {

						margin-left: 5rpx;
						margin-right: 5rpx;
						width: 70rpx;
						text-align: center;
						z-index: 0;
						height: 55rpx;
						line-height: 55rpx;
						color: #000;
						font-size: 24rpx;
					}

					.increase {

						border-right: 1rpx solid #DCDCDC;
						font-size: 30rpx;
					}

					.decrease {

						border-left: 1rpx solid #DCDCDC;
						font-size: 30rpx;
					}
				}
			}
		}

		.goods-action {

			margin-top: 0rpx;
			background: #FFFFFF;
			align-items: center;
			justify-content: center;
			display: flex;
			text-align: center;
			position: fixed;
			bottom: 30rpx;
			left: 30rpx;
			right: 30rpx;
			height: 90rpx;
			// line-height: 90rpx;
			// background: #EF404E;
			color: #fff;
			font-size: 28rpx;
			display: flex;

			// border-radius: 45rpx;
			view {
				width: 50%;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
			}

			.addCart {
				background: #FF961B;
			}

			.buy {
				background: #EE1F2C;
			}
		}
	}
</style>
