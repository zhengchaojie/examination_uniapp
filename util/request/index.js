// 引入配置
import * as configs from '@/common/config.js'
// 初始化请求配置
uni.$u.http.setConfig((defaultConfig) => {
    /* defaultConfig 为默认全局配置 */
    defaultConfig.baseURL = configs.baseurl /* 根域名 */
    return defaultConfig
})

module.exports = (vm) => {
    require('./requestInterceptors')(vm)
    require('./responseInterceptors')(vm)
}
