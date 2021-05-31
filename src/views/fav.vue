<template lang="html">
    <div class="cart">
        <van-empty image="search" description="收藏夹空空如也" v-if="getUser.favlist.length==0" />
        <van-card v-for="item in favlist" :key="item._id" :price="item.price+'.00'" :desc="item.brand" :title="item.name" :thumb="item.pic" @click="toGoods(item)"></van-card>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,Empty} from 'vant'
Vue.use(Card).use(Empty)
export default {
    data(){
        return {
            favlist: []
        }
    },
    watch: {
        getUser: {
            deep: true,
            handler(newVal){
                this.getFavlist(newVal)
            }
        }
    },
    computed: {
        // 获取用户信息
        getUser(){
            return this.$store.state.user
        }
    },
    created(){
        this.getFavlist(this.getUser)
    },
    methods: {
        // 获取收藏中产品id列表，请求对应产品详情列表
        getFavlist(userInfo){
            if(userInfo.favlist.length){
                let {favlist} = userInfo
                // 统计每款商品数量
                this.$http.get('/api/fav',{
                    params: {
                        favlist: JSON.stringify(favlist)
                    }
                }).then(res=>{
                    this.favlist = res.data.data
                })
            }

        },
        // 跳转商品详情
        toGoods(item){
            this.$router.push({path: '/goods/'+item._id})
        }
    }
}
</script>

<style lang="css">
</style>
