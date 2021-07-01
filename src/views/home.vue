<template lang="html">
    <div class="goods">
        <div class="goods-focus">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="item,index in focus" :key="index">
                    <img :src="item">
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="super-nav">
            <van-grid :border="false">
                <van-grid-item @click="signinHandle">
                    <van-icon name="todo-list" size="32" color="#1989fa" />
                    <p>签到</p>
                </van-grid-item>
                <van-grid-item to="/getcoupon">
                    <van-icon name="coupon" size="32" color="#ffd01e" />
                    <p>领券</p>
                </van-grid-item>
                <van-grid-item to="/search">
                    <van-icon name="hot" size="32" color="#ee0a24" />
                    <p>热卖</p>
                </van-grid-item>
                <van-grid-item @click="getGift">
                    <van-icon name="gift" size="32" color="#ff8917" />
                    <p>礼物</p>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="goods-list">
            <van-loading type="spinner" color="#e4393c" v-if="isLoading" />
            <van-grid clickable :column-num="2">
                <van-grid-item :to="{path:'/goods/'+item._id}" v-for="item in goodslist" :key="item._id" :_id="item._id">
                    <img :src="item.pic" alt="item.name" class="pic">
                    <p>{{item.name}}</p>
                    <p>¥{{item.price}}</p>
                </van-grid-item>
            </van-grid>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {Grid,GridItem,Swipe,SwipeItem,Dialog,Icon,Loading} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(Grid).use(GridItem).use(Swipe).use(SwipeItem).use(Dialog).use(Icon).use(Loading)

export default {
    data(){
        return {
            goodslist: [],
            gift: 10000,
            isLoading: true,
            score: 100,
            focus: ['https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/184608/3/9645/86278/60cb3852E34e1266b/f91d2d26b8f72801.jpg!cr_1053x420_4_0!q70.jpg.dpg','https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/189024/12/8372/105443/60c8788bE46baa3cc/d6ec69803d93ca87.jpg!cr_1053x420_4_0!q70.jpg.dpg']
        }
    },
    mixins: [getUserInfoMixin],
    created(){
        this.$http.get('/api/goods').then(res=>{
            this.isLoading =  false
            this.goodslist = res.data.data
        })
    },
    methods: {
        // 获取礼物
        getGift(){
            let {username} = this.userInfo
            // 判断是否登录
            if(username){
                Dialog.alert({
                    title: '送钱啦！',
                    message: `送您${this.gift}块，快来消费吧^_^`,
                }).then(() => {
                    // on confirm
                    this.$http.post('/api/gift',{username,gift: this.gift}).then(res=>{
                        this.$toast(res.data.message)
                        this.$store.commit('setUser',{
                            balance: this.userInfo.balance + this.gift
                        })
                    })
                })
            }else{
                this.$toast('请先登录，再领取礼物哦')
            }
        },
        // 签到
        signinHandle(){
            let {username} = this.userInfo
            // 判断是否登录
            if(username){
                this.$http.post('/api/signin',{
                    username,
                    time: new Date().getTime(),
                    score: this.score
                }).then(res=>{
                    if(res.data.code == 0){
                        //签到成功
                        this.$store.commit('setUser',{
                            score: this.userInfo.score + this.score
                        })
                    }
                    this.$toast(res.data.message)
                })
            }else{
                this.$toast('请先登录，再签到哦')
            }
        }
    }
}
</script>

<style lang="css">
.goods{ padding-bottom: 50px;}
.goods-list{ position: relative;}
.goods-list .van-loading{ position: absolute; left: 50%; top: 100px; transform: translateX(-50%);}
.goods-list .pic{ width: 2.6rem; height: 2.6rem; display: block; margin: 0 auto;}
.goods-list .van-grid-item p{ font-size: .3rem; line-height: .5rem; text-align: center;}
.goods-list .van-grid-item p:last-of-type{ font-size: .36rem; color: #e4393c;}
.goods-focus img{ width: 100%; display: block;}
.super-nav .van-grid-item p{ margin-top: 8px;}
</style>
