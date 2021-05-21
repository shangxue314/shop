<template>
    <div id="app">
        <van-nav-bar :title="$store.state.title" left-text="返回" left-arrow @click-left="clickLeftHandle">
            <template #right>
                <van-icon name="search" size="18"></van-icon>
            </template>
        </van-nav-bar>
        <transition name="fade" mode="out-in">
            <router-view :user="$store.state.user"></router-view>
        </transition>
        <van-tabbar route>
            <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item to="/cart" icon="cart-o" :badge="getBadge">购物车</van-tabbar-item>
            <van-tabbar-item to="/add" icon="setting-o">添加机型</van-tabbar-item>
            <van-tabbar-item to="/user" icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import Vue from 'vue'
import {Tabbar,TabbarItem,NavBar,Icon,Toast} from 'vant'
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Toast)
export default {
  name: 'App',
  methods: {
      clickLeftHandle(){
          this.$router.go(-1)
      }
  },
  computed: {
      getBadge(){
          return this.$store.state.user.cartlist.length ? this.$store.state.user.cartlist.length : ''
      }
  },
  created(){
      // 获取用户信息
      if(this.$local.fetch('myshop').username){
          this.$http.get('/api/user',{
              params: {
                  username: this.$local.fetch('myshop').username
              }
          }).then(res=>{
              this.$store.commit('setUser',res.data.data)
          })
      }
  }
}
</script>

<style>
.fade-enter-active,.fade-leave-active{ transition: opacity .5s;}
.fade-enter,.fade-leave-to{ opacity: 0;}
</style>
