import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from './utils/axios.js'
import local from './utils/local.js'
import '@/assets/css/main.css'
Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(local)

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
