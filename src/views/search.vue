<template lang="html">
    <div class="shop-search">
        <van-dropdown-menu v-if="resultList.length!=0">
            <van-dropdown-item v-model="rankValue" :options="rankList" @change="changeRank('salesValue')" />
            <van-dropdown-item v-model="salesValue" :options="salesList" @change="changeRank('rankValue')" />
        </van-dropdown-menu>
        <van-empty image="search" description="没有商品" v-if="isEmpty" />
        <van-loading type="spinner" color="#e4393c" v-if="isLoading" />
        <van-card v-for="item in resultList" :key="item._id" :price="item.price+'.00'" :title="item.name" :thumb="item.pic" @click="toGoods(item)">
            <template #tags>
                <van-tag color="#eee" text-color="#999" v-for="value,i in item.info" :key="i">{{value}}</van-tag>
            </template>
            <template #price-top>
                <div class="van-card-sales">
                    <span>销量：{{item.sales}}</span>
                    <span>评论：{{item.bbs}}</span>
                </div>
            </template>
        </van-card>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,Empty,DropdownMenu,DropdownItem,Tag,Loading} from 'vant'
Vue.use(Card).use(Empty).use(DropdownMenu).use(DropdownItem).use(Tag).use(Loading)

export default {
    data(){
        return {
            resultList: [],
            rankValue: 'default',
            rankList: [
                {text: '综合', value: 'default'},
                {text: '价格最低', value: 'asc'},
                {text: '价格最高', value: 'desc'}
            ],
            salesValue: 'default',
            salesList: [
                { text: '默认', value: 'default'},
                { text: '销量', value: 'sales' },
                { text: '评价', value: 'bbs' },
            ],
            query: '',
            isLoading: true,
            isEmpty: false
        }
    },
    methods: {
        // 跳转商品详情
        toGoods(item){
            this.$router.push({path: '/goods/'+item._id})
        },
        // 排序
        changeRank(key){
            this[key] = 'default'
            this.$http.get('/api/sort',{
                params: {
                    choose: this.query,
                    rank: this.rankValue,
                    sales: this.salesValue
                }
            }).then(res=>{
                this.resultList = res.data.data
            })
        }
    },
    beforeRouteEnter(to,from,next){
        next(vm=>{
            vm.query = to.query
            vm.$http.get('/api/sort',{
                params: {
                    choose: to.query,
                    rank: vm.rankValue,
                    sales: vm.salesValue
                }
            }).then(res=>{
                vm.isLoading = false
                if(res.data.code == 0){
                    vm.resultList = res.data.data
                }else{
                    vm.isEmpty = true
                }
            })
        })
    }
}
</script>

<style lang="css">
.shop-search{ padding-bottom: 60px;}
.van-card-sales{ display: flex;}
.van-card-sales span{ display: block; width: 33.3333%;}
.shop-search .van-card{ background: #fff;}
.shop-search .van-tag{ margin: 2px;}
.shop-search .van-card__price{ color: #ee0a24;}
.shop-search .van-loading{ margin: 100px auto 0; text-align: center;}
</style>
