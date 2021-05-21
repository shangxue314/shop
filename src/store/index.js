import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        title: '首页',
        user: {
            cartlist: [],
            favlist: []
        }
    },
    mutations: {
        setNavBarTitle(state,payload){
            state.title = payload
        },
        setUser(state,payload){
            state.user = Object.assign(state.user,payload)
        }
    },
    actions: {

    }
})
export default store
