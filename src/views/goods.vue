<template lang="html">
    <div class="detail">
        <img :src="goods.pic" alt="goods.name">
        <p>型号：{{goods.name}}</p>
        <p>品牌：{{goods.brand}}</p>
        <p>价格：¥{{goods.price}}</p>
        <template v-if="goods.info">
            <p v-for="item,index in goods.info" :key="index">{{infoMap[index]}}：{{item}}</p>
        </template>
        <van-goods-action>
            <van-goods-action-icon to="/cart" icon="cart-o" text="购物车" :badge="getBadge" />
            <van-goods-action-icon :icon="isComFav.icon" :text="isComFav.text" :color="isComFav.color" @click="addFav" />
            <van-goods-action-button type="warning" text="加入购物车" @click="addCart" />
            <van-goods-action-button type="danger" text="立即购买" @click="buyGoods" />
        </van-goods-action>
    </div>
</template>

<script>
import Vue from 'vue'
import {GoodsAction,GoodsActionIcon,GoodsActionButton} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton)
export default {
    data(){
        return {
            goods: {},
            isFav: false,
            pid: this.$route.params._id,     // 商品_id
            infoMap: {
                memory: '内存',
                system: '系统',
                net: '网络',
                screen: '屏幕尺寸',
                cpu : '处理器',
                disk: '硬盘',
                grap: '显卡',
                color: '颜色'
            }
        }
    },
    mixins: [getUserInfoMixin],
    created(){
        // 获取商品详情
        this.$http.get('/api/goods/'+this.pid).then(res=>{
            this.goods = res.data.data
        })
        // 从store中判断商品是否已收藏
        if(this.userInfo.favlist){
            this.setIsFav()
        }
        let {username} = this.userInfo
        // 登录状态下商品添加到我的足迹
        if(username){
            this.$http.post('/api/footprint',{
                username,
                pid: this.pid
            }).then(res=>{
                this.$store.commit('setUser',{
                    footprint: res.data.data
                })
            })
        }
    },
    computed: {
        // 是否收藏
        isComFav(){
            return {
                icon: this.isFav?'like':'like-o',
                text: this.isFav?'已收藏':'收藏',
                color: this.isFav?'#ee0a24':''
            }
        },
        // 统计购物车商品数量
        getBadge(){
            return this.userInfo.cartlist.length?this.userInfo.cartlist.reduce((pre,cur)=>pre+cur.num,0):''
        }
    },
    methods: {
        // 设置收藏状态
        setIsFav(){
            this.isFav = this.userInfo.favlist.includes(this.pid)?true:false
        },
        // 加入购物车
        addCart(){
            let {username} = this.userInfo
            if(username){
                // 已登录
                this.$http.post('/api/cart',{
                    username,
                    goodsid: this.pid
                }).then(res=>{
                    this.$store.commit('setUser',{
                        cartlist: res.data.data
                    })
                })
            }else{
                // 未登录
                this.$toast('请先登录')
            }
        },
        // 加入收藏
        addFav(){
            let {username} = this.userInfo
            if(username){
                // 已登录
                this.$http.post('/api/fav',{
                    username,
                    goodsid: this.pid
                }).then(res=>{
                    this.isFav = res.data.data.includes(this.pid)?true:false
                    this.$store.commit('setUser',{
                        favlist: res.data.data
                    })
                })
            }else{
                // 未登录
                this.$toast('请先登录')
            }
        },
        // 立即购买
        buyGoods(){
            this.$router.push({
                path: '/buy',
                query: {pid: this.pid}
            })
        }
    }
}
</script>

<style lang="css">
.detail{ overflow: auto; padding-bottom: 60px;}
.detail>img{ width: 4rem; display: block; margin: 1rem auto;}
.detail p{ font-size: .3rem; line-height: .5rem; padding: 0 1rem; display: flex; align-items: center; margin-top: .1rem;}
.detail .van-goods-action{ z-index: 10000;}
</style>
