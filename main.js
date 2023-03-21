
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import * as Config from './common/config.js'
import uView from '@/uni_modules/uview-ui'
Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
require('./util/request/index')(app)

import httpApi from '@/common/api.js'
Vue.use(httpApi, app)
app.$mount()