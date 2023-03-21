<template>
	<view class="main">
		<view class="title">{{ title }}</view>
		<view class="total">共计题目<text class="num"> {{ num }} </text> / {{ config.fields.length }}</view>
		<u--form labelPosition="top" :model="model" :rules="rules" ref="uForm" :errorType='errorType'>
			<form-item
				v-for="(item, ind) in config.fields" 
				:key='ind' :config='item' 
				:model.sync='model'
				:rules='rules[item.__vModel__]'
				 @change='changes'
				:disabled='item.disabled'></form-item>
		</u--form>
		<u-button class='u-btn' type="primary" @click="submit">提交</u-button>
	</view>
</template>

<script>
	import json from '@/pages/question/data.json'
	import { deepClone } from '@/common/props.js'
	export default {
		props: {
			edit: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				config: {},
				errorType: 'message',
				model: {},
				rules: {},
				title: '关于某某某某某方面的问卷调查',
				num: 0
			}
		},
		onLoad(e) {
			console.log('json', json)
			this.config = deepClone(json)
			this.buildRules(this.config.fields, this.rules)
			this.initFormData(this.config.fields, this.model)
			console.log(this.rules)
		},
		methods: {
			submit() {
				console.log('this.model', this.model)
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					console.log('errors', errors)
					uni.$u.toast('校验失败')
				})			
			},
			changes(value, key) {
			    console.log('this.model', this.model, this.rules)
			    this.$set(this.model, key, value)  
			},
			initFormData(componentList, formData) {
				componentList.forEach(cur => {
					const config = cur.__config__
					if (this.edit) this.$set(this.model, cur.__vModel__, cur.__config__.defaultValue)
					else if (cur.__vModel__) this.$set(this.model, cur.__vModel__, '')
					if (config.type === 'texts') this.$set(this.model, cur.__vModel__, config.desc_texts)
					if (config.type === 'upload'||config.type === 'checkbox') this.$set(this.model, cur.__vModel__, [])
					if (config.children) this.initFormData(config.children, formData)
				})
			},
			buildRules(componentList, rules) {
				componentList.forEach(cur => {
					const config = cur.__config__
					if (Array.isArray(config.regList)) {
						if (config.required) {
							const required = {
								required: config.required,
								message: cur.placeholder
							}
							if (Array.isArray(config.defaultValue)) {
								required.type = 'array'
								required.message = `请至少选择一个${config.label}`
							}
							required.message === undefined && (required.message = `${config.label}不能为空`)
							config.regList.push(required)
						}
						rules[cur.__vModel__] = config.regList.map(item => {
							item.pattern && (item.pattern = eval(item.pattern))
							item.trigger = ['change', 'blur']
							return item
						})
					}
					if (config.children) this.buildRules(config.children, rules)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.main{
	padding: 35rpx 30rpx;
	.title{
		width: 100%;
		font-size: 42rpx;
		font-weight: 400;
		color: #000000;
		text-align: center;
	}
	.total{
		width: calc(100% - 30rpx);
		height: 63rpx;
		background: #FFFFFF;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		line-height: 63rpx;
		margin: 30rpx 0 0rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		padding-left: 30rpx;
		white-space: pre-wrap;
		.num{
			color: #0255F3;
			margin: 0 8rpx;
		}
	}
	.u-btn{
		margin-top: 30rpx;
	}

}
</style>
