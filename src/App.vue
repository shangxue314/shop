<template>
    <div id="app">
        <!--标题栏-->
        <van-nav-bar :title="$store.state.title" left-text="返回" left-arrow @click-left="clickLeftHandle">
            <template #right>
                <!--...导航-->
                <van-popover v-model="showMenus" trigger="click" placement="bottom-end" theme="dark" :actions="menus" @select="onSelectMenus">
                    <template #reference>
                        <van-icon name="ellipsis" size="22"></van-icon>
                    </template>
                </van-popover>
            </template>
        </van-nav-bar>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <!--底部导航-->
        <van-tabbar route active-color="#ee0a24">
            <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item to="/sort" icon="qr">分类</van-tabbar-item>
            <van-tabbar-item to="/cart" icon="cart-o" :badge="getBadge">购物车</van-tabbar-item>
            <van-tabbar-item to="/add" icon="setting-o">添加机型</van-tabbar-item>
            <van-tabbar-item to="/user" icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import Vue from 'vue'
import {Tabbar,TabbarItem,NavBar,Icon,Toast,Popover} from 'vant'
Vue.use(Tabbar).use(TabbarItem).use(NavBar).use(Icon).use(Toast).use(Popover)
export default {
    name: 'App',
    data(){
        return {
            showMenus: false,
            menus: [
                {text: '首页', path: '/'},
                {text: '分类', path: '/sort'},
                {text: '购物车', path: '/cart'},
                {text: '我的', path: '/user'}
            ]
        }
    },
    computed: {
        getBadge(){
            return this.$store.state.user.cartlist.length?this.$store.state.user.cartlist.reduce((pre,cur)=>pre+cur.num,0):''
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
    },
    methods: {
        clickLeftHandle(){
            this.$router.go(-1)
        },
        onSelectMenus(action){
            this.$router.push(action.path)
        }
    }
}
</script>

<style>
.fade-enter-active,.fade-leave-active{ transition: opacity .5s;}
.fade-enter,.fade-leave-to{ opacity: 0;}
.van-info{ word-break: keep-all;}
.van-nav-bar .van-icon{ color: #333;}
.van-nav-bar__text{ color: #333;}
.van-nav-bar__right{ padding-right: .1rem;}
.van-icon-ellipsis{ margin: 5px 15px 0 0;}
</style>
