import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Add from '@/views/add'
import Goods from '@/views/goods'
import Cart from '@/views/cart'
import User from '@/views/user'
import Fav from '@/views/fav'
import Login from '@/views/login'
import Sign from '@/views/sign'
import Config from '@/views/config'
import AddressList from '@/views/addresslist'
import AddressEdit from '@/views/addressedit'
import Sort from '@/views/sort'
import Search from '@/views/search'
import Buy from '@/views/buy'
import Order from '@/views/order'
import store from '@/store'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            meta: {
              title: '首页',
              login: false
            },
            component: Home
        },
        {
            path: '/cart',
            name: 'Cart',
            meta: {
                title: '购物车',
                login: false
            },
            component: Cart
        },
        {
            path: '/fav',
            name: 'Fav',
            meta: {
                title: '我的收藏',
                login: true
            },
            component: Fav
        },
        {
            path: '/add',
            name: 'Add',
            meta: {
              title: '添加商品',
              login: false
            },
            component: Add
        },
        {
            path: '/user',
            name: 'User',
            meta: {
                title: '我的',
                login: true
            },
            component: User
        },
        {
            path: '/goods/:_id',
            name: 'Goods',
            meta: {
                title: '商品详情',
                login: false
            },
            component: Goods
        },
        {
            path: '/login',
            name: 'Login',
            meta: {
                title: '登录'
            },
            component: Login
        },
        {
            path: '/sign',
            name: 'Sign',
            meta: {
                title: '注册'
            },
            component: Sign
        },
        {
            path: '/config',
            name: 'Config',
            meta: {
                title: '个人信息',
                login: true
            },
            component: Config
        },
        {
            path: '/addresslist',
            name: 'AddressList',
            meta: {
                title: '地址管理',
                login: true
            },
            component: AddressList
        },
        {
            path: '/addressedit',
            name: 'AddressEdit',
            meta: {
                title: '新增地址',
                login: true
            },
            component: AddressEdit
        },
        {
            path: '/addressedit/:_id',
            name: 'AddressEdit',
            meta: {
                title: '编辑地址',
                login: true
            },
            component: AddressEdit
        },
        {
            path: '/sort',
            name: 'Sort',
            meta: {
                title: '分类',
                login: false
            },
            component: Sort
        },
        {
            path: '/search',
            name: 'Search',
            meta: {
                title: '商品搜索',
                login: false
            },
            component: Search
        },
        {
            path: '/buy',
            name: 'Buy',
            meta: {
                title: '商品订单',
                login: true
            },
            component: Buy
        },
        {
            path: '/order',
            name: 'Order',
            meta: {
                title: '我的订单',
                login: true
            },
            component: Order
        },
        {
          path: '*',
          redirect: '/'
        }
    ]
})
//判断是否需要登录
router.beforeEach((to, from, next)=>{
    // to.matched 记录访问路由和父路由的对象数组
    // 判断路由元信息是否需要登录
    if(to.matched.some(item=>item.meta.login)){
      // 箭头函数中this指向不是Vue根实例了，需用router.app代替
      let userInfo = router.app.$local.fetch('myshop')
      if(userInfo.username){
          next()
      }else{
          router.push({
              path: '/login',
              query: {
                  // 通过添加查询字符串来记录源导航的值，登录后通过此值跳转到对应页
                  redirect: to.path.slice(1)
              }
          })
      }
    }else{
      next()
    }
})
// 全局后置钩子
router.afterEach((to)=>{
    // 设置document的title
    document.title = to.meta.title
    // 设置navBar的title
    store.commit('setNavBarTitle',to.meta.title)
})
export default router
