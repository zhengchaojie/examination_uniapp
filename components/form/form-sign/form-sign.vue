<template>
	<view>
		<u-popup class="bigbox" :show="showCanvas" mode="center" width="80%" height="60%" border-radius="32">
			<canvas  v-if="!imageShow" :src="imageUrl" class="my-canvas-cls" canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
			<!-- <u-notice-bar v-if="imageShow" mode="horizontal" :list="['请先清空签名版再进行签名']"></u-notice-bar> -->
			<u-image v-if="imageShow" :src="imageUrl" width="100%" mode='scaleToFill' height="600rpx" class="my-canvas-cls"></u-image>
			<view class="footer-class">
				<u-button class="but-class" @click="finish" type="primary" :plain="true" shape="square" :ripple="true" ripple-bg-color="#909399"> 保存 </u-button>
				<u-button class="but-class" @click="clear" type="warning" :plain="true" shape="square" :ripple="true" ripple-bg-color="#909399"> 清除 </u-button>
				<u-button class="but-class" @click="close" type="error" :plain="true" shape="square" :ripple="true" ripple-bg-color="#909399">关闭 </u-button>
			</view>
		</u-popup>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				//绘图图像
				ctx:'',
				//路径点集合
				points: [],
				imageUrl: '', //签名图片
				imageShow: false //是否显示签名完成的图片
			};
		},
		props: {
			showCanvas:{
				type:Boolean,
				default:false
			},
			baseImage:{
				type:String,
				default:''
			}
		},
		watch:{
			baseImage(val){
				if(val){
					this.imageShow = true;
					this.imageUrl = val;
				}
			},
			showCanvas(val){
				if(val && this.$props.baseImage){
					this.imageShow = true;
					this.imageUrl = this.$props.baseImage;
				}
			}
		},
		methods: {
			//关闭并清空画布
			close() {
				this.$emit('closeCanvas');
				this.createCanvas();
				this.clear();
			},
			//创建并显示画布
			createCanvas() {
				this.ctx = uni.createCanvasContext('mycanvas', this); //创建绘图对象
				//设置画笔样式
				this.ctx.lineWidth = 4;
				this.ctx.lineCap = 'round';
				this.ctx.lineJoin = 'round';
			},
			//触摸开始，获取到起点
			touchstart(e) {
				// this.imageShow = false;
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {
					X: startX,
					Y: startY
				};
				this.points.push(startPoint);
				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},
			//触摸移动，获取到路径点
			touchmove(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {
					X: moveX,
					Y: moveY
				};
				this.points.push(movePoint); //存点
				let len = this.points.length;
				if (len >= 2) {
					this.draw(); //绘制路径
				}
			},
			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend() {
				this.points = [];
			},
			//绘制笔迹
			draw() {
				let point1 = this.points[0];
				let point2 = this.points[1];
				this.points.shift();
				this.ctx.moveTo(point1.X, point1.Y);
				this.ctx.lineTo(point2.X, point2.Y);
				this.ctx.stroke();
				this.ctx.draw(true);
			},
			//清空画布
			clear() {
				let that = this;
				if(this.imageShow){
					if (this.imageUrl) {
						this.imageUrl = '';
						this.imageShow = false;
						
					}
				}else{
					uni.getSystemInfo({
						success: function(res) {
							// 设置画笔样式
							let canvasw = res.windowWidth;
							let canvash = res.windowHeight;
							that.ctx.clearRect(0, 0, canvasw, canvash);
							that.ctx.draw(true);
						} 
					});
				}
				this.createCanvas();
			},
			//完成绘画并保存到本地
			finish() {
				let that = this;
				uni.canvasToTempFilePath({
						canvasId: 'mycanvas',
						success: function(res) {
							that.imageShow = true;
							that.imageUrl = res.tempFilePath;
							that.$emit('closeCanvas');
							that.$emit('change', res.tempFilePath);
							that.close();
						}
					},
					// this
				);
			},
		},
		mounted() {
			this.createCanvas();
		}
	};
</script>
<style lang="less" scoped>
	/deep/ .uni-scroll-view{
		overflow:inherit !important
	}
	.bigbox{
		touch-action: none
	}
	.my-canvas-cls {
		height: 80vh;
		width: 100%;
		display: block;
		position: relative;
		background: #F6F6F6;
	}

	.footer-class {
		font-size: 14px;
		height: 150upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding-left: 40rpx;
	}

	.but-class {
		margin-right: 40rpx;
	}
</style>

