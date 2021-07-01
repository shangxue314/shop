<template lang="html">
    <div class="shop-order">
        <van-empty description="还没有订单" v-if="isEmpty" />
        <van-loading type="spinner" color="#e4393c" v-if="isLoading" />
        <div class="shop-order-item" v-for="item in orderlist" :key="item._id">
            <p class="oid">订单编号：{{item._id}}</p>
            <div class="info">
                <div class="pic">
                    <img :src="value" v-for="value,index in item.pic" :key="index">
                </div>
                <h2 v-if="item.pic.length==1">{{item.pname[0]}}</h2>
                <p>
                    <span>¥{{item.totalPrice-item.couponPrice}}</span>
                    <span>共{{item.num}}件</span>
                </p>
            </div>
            <!-- <p class="button"><van-button plain round hairline type="primary" color="#ee0a24">再次购买</van-button></p> -->
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {Button,Empty,Loading} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(Button).use(Empty).use(Loading)
export default {
    data(){
        return {
            orderlist: [],
            isLoading: true,
            isEmpty: false
        }
    },
    mixins: [getUserInfoMixin],
    created(){
        this.$http.get('/api/order',{
            params: {username: this.userInfo.username}
        }).then(res=>{
            this.isLoading = false
            if(res.data.code == 0){
                this.orderlist = res.data.data
            }else{
                this.orderlist = []
                this.isEmpty = true
            }
        })
    }
}
</script>

<style lang="css">
.shop-order{ background: #f7f7f7; padding-bottom: 60px; box-sizing: border-box; min-height: calc(100vh - 0.92rem)}
.shop-order-item{ padding: 10px 15px; margin-bottom: 10px; background: #fff;}
.shop-order-item .oid{ text-align: right; font-size: 10px; color: #666;}
.shop-order-item .info{ display: flex; align-items: center; justify-content: space-between;}
.shop-order-item .info img{ width: 88px; display: block;}
.shop-order-item .info h2{ font-size: 14px; font-weight: 500; flex: 1;}
.shop-order-item .info p span{ display: block;}
.shop-order-item .info p span:nth-child(1){ font-size: 16px;}
.shop-order-item .info p span:nth-child(2){ font-size: 10px; color: #999;}
.shop-order-item .info .pic{ display: flex;}
.shop-order-item .button{ text-align: right;}
.shop-order-item .van-button--normal{ font-size: 12px; padding: 0 15px; height: 30px;}
.shop-order .van-loading{ margin: 100px auto 0; text-align: center;}
</style>
