<template lang="html">
    <div class="cart">
        <van-empty image="search" description="收藏夹空空如也" v-if="getUser.favlist.length==0" />
        <van-card v-for="item in favlist" :key="item._id" :price="item.price+'.00'" :desc="item.brand" :title="item.name" :thumb="item.pic" @click="toGoods(item)"></van-card>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,Empty} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(Card).use(Empty)
export default {
    data(){
        return {
            favlist: []
        }
    },
    mixins: [getUserInfoMixin],
    created(){
        let {username,favlist} = this.userInfo
        this.$http.get('/api/fav',{
            params: {
                username,
                favlist
            }
        }).then(res=>{
            this.favlist = res.data.data
        })
    },
    methods: {
        // 跳转商品详情
        toGoods(item){
            this.$router.push({path: '/goods/'+item._id})
        }
    }
}
</script>

<style lang="css">
.cart .van-card{ background: #fff;}
</style>
