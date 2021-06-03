<template lang="html">
    <div class="shop-order">
        <div class="shop-order-item" v-for="item in orderlist" :key="item._id">
            <div class="info">
                <div class="pic">
                    <img :src="value" v-for="value,index in item.pic" :key="index">
                </div>
                <h2 v-if="item.pic.length==1">{{item.pname[0]}}</h2>
                <p>
                    <span>¥{{item.totalPrice}}</span>
                    <span>共{{item.pic.length}}件</span>
                </p>
            </div>
            <!-- <p class="button"><van-button plain round hairline type="primary" color="#ee0a24">再次购买</van-button></p> -->
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {Button} from 'vant'
Vue.use(Button)
export default {
    data(){
        return {
            orderlist: []
        }
    },
    created(){
        this.$http.get('/api/order',{
            params: {username: this.$local.fetch('myshop').username}
        }).then(res=>{
            console.log(res.data.data);
            this.orderlist = res.data.data
        })
    }
}
</script>

<style lang="css">
.shop-order{ background: #f7f7f7;}
.shop-order-item{ padding: 10px 15px; margin-bottom: 10px; background: #fff;}
.shop-order-item .info{ display: flex; align-items: center; justify-content: space-between;}
.shop-order-item .info img{ width: 88px; display: block;}
.shop-order-item .info h2{ font-size: 14px; font-weight: 500; flex: 1;}
.shop-order-item .info p span{ display: block;}
.shop-order-item .info p span:nth-child(1){ font-size: 16px;}
.shop-order-item .info p span:nth-child(2){ font-size: 10px; color: #999;}
.shop-order-item .info .pic{ display: flex;}
.shop-order-item .button{ text-align: right;}
.shop-order-item .van-button--normal{ font-size: 12px; padding: 0 15px; height: 30px;}
</style>
