<template lang="html">
    <div class="shop-score">
        <van-empty description="还没有积分" v-if="isEmpty" />
        <van-loading type="spinner" color="#e4393c" v-if="isLoading" />
        <div class="shop-score-item" v-for="item in scorelist" :key="item._id">
            <h2>{{item.title}}<span v-if="item.orderId">订单编号：{{item.orderId}}</span><time>{{formatDate(item.date)}}</time></h2>
            <p>+{{item.num}}</p>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {Empty,Loading} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
import moment from 'moment'
Vue.use(Empty).use(Loading)
export default {
    data(){
        return {
            scorelist: [],
            isLoading: true,
            isEmpty: false
        }
    },
    mixins: [getUserInfoMixin],
    created(){
        this.$http.get('/api/score',{
            params: {username: this.userInfo.username}
        }).then(res=>{
            this.isLoading = false
            if(res.data.code == 0){
                this.scorelist = res.data.data
            }else{
                this.scorelist = []
                this.isEmpty = true
            }
        })
    },
    methods: {
        // 格式化日期
        formatDate(t){
            return moment(t).format('YYYY/MM/DD')
        }
    }
}
</script>

<style lang="css">
.shop-score{ background: #f7f7f7; padding-bottom: 60px; box-sizing: border-box; min-height: calc(100vh - 0.92rem)}
.shop-score-item{ padding: 10px 15px; border-bottom: 1px solid #eee; background: #fff; display: flex; justify-content: space-between; align-items: center;}
.shop-score-item h2{ font-weight: 500; font-size: 14px; line-height: 24px;}
.shop-score-item h2 time{ display: block; color: #666; font-size: 12px;}
.shop-score-item h2 span{ font-size: 12px; color: #666; display: block;}
.shop-score-item p{ font-size: 22px; color: #e4393c;}

.shop-score .van-loading{ margin: 100px auto 0; text-align: center;}
</style>
