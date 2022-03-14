import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Mixin from './mixin'

import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'

Vue.use(ElementUI)

import '@/styles/index.scss' // global css

Vue.mixin(Mixin)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
