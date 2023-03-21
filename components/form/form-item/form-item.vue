<template>
	<div class='form-item'>
		<u-form-item
			:prop="config.__vModel__"
			>
			<span v-if='config.__config__.showLabel' class='label' slot='label'>
			    <span>{{ config.__config__.label }}</span>
			</span>
			<u--input
				v-if="inputList.includes(config.__config__.type)"
				:type='config.__config__.type === "input" ? "text" : config.__config__.type'
				v-model="data[config.__vModel__]"
				:disabled='disabled || config.readOnly'
				:placeholder='config.placeholder'
				:allowClear='true'
				:maxlength='config.maxLength || 999'
			></u--input>
			<u--textarea 
				v-else-if="config.__config__.type === 'textarea'"
				v-model="data[config.__vModel__]"
				:disabled='disabled || config.readOnly'
				:placeholder='config.placeholder'
				:allowClear='true'
				:maxlength='config.maxLength || 999'
			></u--textarea>		
			<u-checkbox-group
				v-else-if="config.__config__.type === 'checkbox'"
			    v-model="data[config.__vModel__]"
			    @change="handleChanges($event, config.__vModel__)"
				:disabled='disabled || config.readOnly'
				placement='column'
			>
			    <u-checkbox
			        :customStyle="{marginBottom: '8px'}"
			        v-for="(item, index) in config.__slot__.options ? config.__slot__.options : []"
			        :key="index"
			        :label="item.label"
			        :name="item.value"
			    >
			    </u-checkbox>
			</u-checkbox-group>
			<u-radio-group 
				v-else-if="config.__config__.type === 'radio'"
				v-model="data[config.__vModel__]" @change="handleChange($event, config.__vModel__)"
				:disabled='disabled || config.readOnly'
				placement='column'>
				<u-radio
					:customStyle="{marginBottom: '8px'}"
					v-for="(item, index) in config.__slot__.options ? config.__slot__.options : []" 
					:key="index" 
					:name="item.value"
					:label="item.label"
				>
				</u-radio>		
			</u-radio-group>
			<template v-else-if="config.__config__.type === 'select'">
				<u-select
					v-model="showSelect"
					:list="config.__slot__.options ? config.__slot__.options : []"
					:disabled='disabled || config.readOnly'
					mode="single-column"
					@confirm="selectChange($event, config.__vModel__)">
				</u-select>
				<view @click="showSelect = true" class="Select" :class="selectValue ? 'active': 'gray'">
					{{ selectValue ? selectValue : '请选择选项' }}
				</view>
			</template>
			<template v-else-if="config.__config__.type === 'cascader'">
				<u-select
					v-model="showSelect"
					:list="config.options ? config.options : []"
					:disabled='disabled || config.readOnly'
					:mode="config.__config__.type === 'cascader' ? 'mutil-column-auto' : 'single-column'"
					@confirm="selectChange($event, config.__vModel__)">
				</u-select>
				<view @click="showSelect = true" class="Select" :class="selectValue ? 'active': 'gray'">
					{{ selectValue ? selectValue : '请选择选项' }}
				</view>
			</template>
			<form-text 
				v-if="config.__config__.type === 'texts'"
			    :texts='config.__config__.desc_texts'
			    :align='config.__config__.align'
			    :color='config.__config__.color'
			    :fontsize='config.__config__.fontSize'
			    @change='handleChange($event, config.__vModel__)'
			/>
			<template v-if="config.__config__.type === 'signCanvas'">
				<form-sign
					@change='imageChange($event, config.__vModel__)'
					:showCanvas="showCanvas" :baseImage="baseImage" @closeCanvas="closeCanvas"
				/>
				<view class="sign" @click="showCanvas = true">
					<u-image :src='baseImage' mode='scaleToFill' width="100%" height="250rpx" />
				</view>
			</template>
			<template v-if="timeList.some(item => item.type === config.__config__.type)">
				<u-datetime-picker
				    :show="showTime"
					:mode='timeType(config.__config__.type)'
				    v-model="data[config.__vModel__]"
					:closeOnClickOverlay='true'
					:disabled='disabled || config.readOnly'
					@close='showTime = false'
					@confirm='timeConfirm($event, config.__vModel__)'
				></u-datetime-picker>
				<view class="date" @click="showTime = true">
					<view class="dateValue" :class="dateValue ? 'active': 'gray'">{{ dateValue ? dateValue : '请选择时间' }}</view>
					<u-icon name="arrow-right" color="#949699" size="14"></u-icon>
				</view>
			</template>
			<u-switch 
				v-if="config.__config__.type === 'switch'"
				v-model="data[config.__vModel__]" 
				:disabled='disabled || config.readOnly'
				@change="handleChanges($event, config.__vModel__)">
			</u-switch>
			<u-slider 
				v-if="config.__config__.type === 'slider'"
				v-model="data[config.__vModel__]" 
				:min="config.min" 
				:disabled='disabled || config.readOnly'
				:max="config.max"
				style='width: 100%;'
				@change="handleChange($event, config.__vModel__)">
			</u-slider>
			<u-rate 
				v-if="config.__config__.type === 'rate'"
				:count="config.max" 
				allowHalf
				:disabled='disabled || config.readOnly'
				v-model="data[config.__vModel__]"
				@change="handleChange($event, config.__vModel__)">
			</u-rate>
			<u-upload
				v-if="config.__config__.type === 'upload'"
				:fileList="fileList1"
				@afterRead="afterRead($event, config.__vModel__)"
				@delete="deletePic($event, config.__vModel__)"
				name="1"
				:previewFullImage="true"
				multiple
				:maxCount="10"
			></u-upload>
		</u-form-item>
	</div>
</template>

<script>
	import { deepClone } from '@/common/props.js'
	export default {
		props: {
			config: {
				type: Object,
				default: ()=> {}
			},
			rules: {
				type: Array,
				default: ()=> []
			},
			disabled: {
				type: Boolean,
				default: false
			},
			model: {
				type: Object,
				default: ()=> {}
			}
		},
		data() {
			return {
				inputList: ['input', 'password', 'number'],
				data: deepClone(this.model),
				showSelect: false,
				showCanvas: false,
				showTime: false,
				selectValue: '',
				baseImage: '',
				timeList: [{ type: 'date', value: 'datetime' }, { type: 'time', value: 'time' }, { type: 'month', value: 'year-month' }],
				dateValue: '',
				fileList1: []
			}
		},
		watch: {
			
		},
		mounted() {
			console.log()
		},
		methods: {
			selectChange(e, key) {
				this.selectValue = e[e.length - 1].label
				this.$set(this.data, key, e[e.length - 1].value.toString())
				this.$emit('change', e[e.length - 1].value.toString(), key)
			},
			handleChange(e, key) {
				let value = e.toString()
				if (e && e.target) {
				  value = e.target.value.toString()
				}
				this.$set(this.data, key, value)
				this.$emit('change', value, key)      
			},
			handleChanges(e, key) {
				console.log(e)
				this.$set(this.data, key, e)
				this.$emit('change', e, key)   
			},
			timeConfirm(e, key) {
				let value = this.formatTime(e.value, e.mode)
				this.$set(this.data, key, value)
				this.$emit('change', value, key)   
				this.dateValue = value
				this.showTime = false   
			},
			closeCanvas() {
				this.showCanvas = false
			},
			imageChange(e, key) {
				this.baseImage = e
			},
			timeType(type) {
				let result = ''
				this.timeList.forEach(item => {
					if(item.type === type){
						result = item.value
					}
				})
				return result
			},
			formatTime(time, mode) {
				const timeFormat = uni.$u.timeFormat
				switch (mode) {
					case 'datetime':
						return timeFormat(time, 'yyyy-mm-dd hh:MM')
					case 'date':
						return timeFormat(time, 'yyyy-mm-dd')
					case 'year-month':
						return timeFormat(time, 'yyyy-mm')
					case 'time':
						return time
					default:
						return ''
				}			
			},
			// 删除图片
			deletePic(event, key) {
				this[`fileList${event.name}`].splice(event.index, 1)
				this.$set(this.data, key, this[`fileList${event.name}`])
			},
			// 新增图片
			async afterRead(event, key) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
				this.$set(this.data, key, this[`fileList${event.name}`])
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: '', 
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					})
				})
			},			
		}
	}
</script>

<style lang="scss" scoped>
	.label{
		font-size: 31rpx;
		font-weight: normal;
		color: #000000;
		margin-bottom: 10rpx;
	}
	.form-item{
		background: #FFFFFF;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		padding: 20rpx;
		margin-top: 20rpx;
	}
	.Select{
		border: 1rpx solid #e4e7ed;
		width: 100%;
		height: 70rpx;
		border-radius: 8rpx;
		font-size: 30rpx;
		line-height: 70rpx;
		text-indent: 20rpx;
	}
	.active{
		color: rgb(48, 49, 51);
	}
	.gray{
		color: rgb(192, 196, 204);
	}
	.sign{
		width: 100%;
	}
	.date{
		width: calc(100% - 30rpx);
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.dateValue{
			font-size: 28rpx;
		}
	}
</style>