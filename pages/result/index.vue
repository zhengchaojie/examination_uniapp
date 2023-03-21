<template>
	<view class="main">
		<view class="imgs">
			<u-image v-if="result === 'success'" src='/../../static/success.png' width='340rpx' height='340rpx' radius='5' :fade="true"
				duration="450"></u-image>
			<u-image v-if="result === 'fail'" src='/../../static/fail.png' width='340rpx' height='340rpx' radius='5' :fade="true"
				duration="450"></u-image>	
		</view>
		<view class="result">{{ result === 'success' ? '提交成功' : '提交失败' }}</view>
		<view class="back" @click="back">返回首页</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result: 'success'
			}
		},
		onLoad(e) {
			
		},
		methods: {
			back(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.imgs{
		width: 100%;
		margin-top: 150rpx;
		display: flex;
		justify-content: center;
	}
	.result{
		margin-top: 40rpx;
		font-size: 38rpx;
		font-weight: normal;
		color: #000000;
		text-align: center;
	}
	.back{
		margin-top: 40rpx;
		font-size: 31rpx;
		font-weight: normal;
		color: #0255F3;
		text-align: center;
	}
</style>