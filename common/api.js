console.log('uni.$u', uni)
const { http } = uni.$u
import qs from '@/common/qs.js'
import * as configs from '@/common/config.js'
// 获取菜单
// export const fetchMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)uni.$u.http.config.baseURL = configs.baseUrl
const install = (Vue, vm) => {
	//	-------------------------------登接口开始---------------------------------
		// 获取验证码
		let imgCode = (params, config  = {}) => http.get(`/captchaImage`, params)
		
	//	-------------------------------登录接口结束---------------------------------
	
	   
	//	-------------------------------个人中心接口结束---------------------------------
	vm.$u.api = {
			imgCode
		}
}
export default {
	install
}