import axios from 'axios'
import Vue from 'vue'
import {Toast} from 'vant'
Vue.use(Toast)
axios.defaults.timeout = 8000
axios.defaults.retry = 3
axios.defaults.retryDelay = 1000

// axios.interceptors.request.use(config=>{
//     // dosomething
//     return config
// },err=>{
//     return Promise.reject(err)
// })

axios.interceptors.response.use(response=>{
    // dosomething
    return response
},error=>{
    if(error.message.includes('timeout')){
        Toast('请求超时');
    }
    //超时处理
    var config = error.config;
    if (!config || !config.retry) return Promise.reject(error);
    // 设置用于跟踪重试次数的变量
    config.__retryCount = config.__retryCount || 0;

    // 检查我们是否已将重试总数最大化
    if (config.__retryCount >= config.retry) {
        // 错误拒绝
        return Promise.reject(error);
    }
    // 增加重试次数
    config.__retryCount += 1;
    // 创造新的承诺来处理指数退避
    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });
    // 返回承诺，其中将撤回axios以重试请求
    return backoff.then(function () {
        return axios(config);
    });
})
export default axios
