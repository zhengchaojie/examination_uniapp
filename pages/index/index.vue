<template>
	<view class="container">
		<view class="search">
			<u-search v-model="keywords" @search="search" @clear="clear" :showAction="false" placeholder="搜索问卷名"
				shape="round" style='width: 100%;' bg-color='#fff' actionText='搜索'>
			</u-search>
		</view>
		<view class="content">
			<view class="questions">
				<u-image src='/../../static/banner.png' width="100%" height="250rpx" />
			</view>
			<scroll-view class="scroll-list" scroll-y="true" refresher-enabled="true" @refresherrefresh="refresher"
				@scrolltolower="scrolltolower" :refresher-triggered="triggered">
				<template v-if="list.length > 0">
					<template v-for="(item, ind) in list">
						<view class="item" @click="goNewsDetail(item)" :key="ind">
							<view class="item_top">
								<view class="item_top_left" :class="item.status == 1 ? 'active' : 'invalid'">
									{{ item.status == 1 ? '立即参与' : '已结束' }}
								</view>
								<view v-if="item.status == 2" class="item_top_right">
									<u-image src='/../../static/juan.png' width='11' height='12' radius='5' :fade="true"
										duration="450"></u-image>
									<text class="right_desc">查看我的问卷</text>	
								</view>
							</view>
							<view class="item_con">
								<view class="item_title">{{ item.title }}</view>
								<view class="item_desc">{{ item.desc }}</view>
							</view>
						</view>
					</template>
					<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
						:nomore-text="nomoreText" />
				</template>
				<template v-else>
					<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" text="暂无数据">
					</u-empty>
				</template>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				keywords: '',
				list: [
					{ title: '关于1方面的问卷调查', status: 1, desc: '请记录您宝贵的意见，我们会真诚的予以改善和加强管理诚的予以改善和加强管理。' },
					{ title: '关于2方面的问卷调查', status: 2, desc: '请记录您宝贵的意见，我们会真诚的予以改善和加强管理诚的予以改善和加强管理。' },
				],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有数据啦',
				triggered: false
			}
		},
		methods: {
			search() {
				this.pageNum = 1
				this.pageSize = 10
				this.list = []
				this.getList()
			},
			clear() {
				this.pageNum = 1
				this.pageSize = 10
				this.list = []
				this.keywords = ''
				this.getList()
			},
			getList() {
				const data = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					projectName: this.keywords
				}
				this.status = 'loading'
				this.$u.api.scientificReports(data).then(res => {
					console.log(res)
					this.total = res.data.total
					if (res.data.list.length > 0) {
						this.pageNum += 1
						this.list = this.list.concat(res.data.list)
						this.status = 'loadmore'
					} else {
						this.status = 'nomore'
					}
					this.triggered = false
					if(this.total <= this.list.length ) {
						this.status = 'nomore'
					}
				})
			},
			goNewsDetail(obj) {
				const detail = JSON.stringify(obj)
				uni.navigateTo({
					url: `/pages/question/index?detail=${detail}`
				})
				// uni.navigateTo({
				// 	url: `/pages/result/index?detail=${detail}`
				// })
			},
			refresher() {
				console.log('下拉刷新')
				this.pageNum = 1
				this.pageSize = 10
				this.list = []
				this.triggered = true
				this.status = 'loading'
				this.keywords = ''
				this.getList()
			},
			scrolltolower() {
				console.log('触底刷新')
				if( this.status != 'nomore' )  {
					this.getList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 40rpx;
		height: 100%;
		width: calc(100% - 80rpx);
		.search{
			height: 130rpx;
			display: flex;
			align-items: center;
		}
		.content{
			height: calc(100% - 130rpx - 250rpx);
			.scroll-list {
				height: 100%;
				.item{
					width: 100%;
					height: 225rpx;
					background: #FFFFFF;
					border-radius: 10rpx;
					margin-top: 33rpx;
					.item_top{
						display: flex;
						height: 51rpx;
						justify-content: space-between;
						align-items: center;
						.item_top_left{
							width: 152rpx;
							height: 100%;
							background: rgba(255,136,16,0.1);
							border-radius: 10rpx 0rpx 10rpx 0rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.item_top_right{
							height: 100%;
							font-size: 24rpx;
							font-weight: normal;
							color: #0255F3;
							display: flex;
							justify-content: flex-end;
							align-items: center;
							.right_desc{
								margin: 0 10rpx;
							}
						}
						.active{
							color: #FF5700;
							background: rgba(255,136,16,0.1);
						}
						.invalid{
							color: #7076A2;
							background: rgba(111,123,180,0.1);
						}
					}
					.item_con{
						width: calc(100% - 66rpx);
						height: 174rpx;
						padding: 0 33rpx;
						.item_title{
							height: 60rpx;
							width: 100%;
							font-size: 31rpx;
							font-weight: normal;
							color: #000000;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							display: flex;
							align-items: center;
						}
						.item_desc{
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							font-size: 28rpx;
							font-weight: normal;
							color: #999999;
							text-indent: 56rpx;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
	.u-search__content{
		background: #FFFFFF !important;
	}
</style>
