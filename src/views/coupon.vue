<template lang="html">
    <div class="shop-coupons">
        <van-empty description="还没有优惠券" v-if="isEmpty" />
        <van-loading type="spinner" color="#e4393c" v-if="isLoading" />
        <ul>
            <li v-for="item in coupons" :key="item._id">
                <div>
                    <p><b>{{item.valueDesc}}</b>{{item.unitDesc}}</p>
                    <p v-html="item.condition"></p>
                </div>
                <h2>
                    <b>{{item.name}}</b>
                    <time>{{setStartAt(item.startAt)}}-{{setStartAt(item.endAt)}}</time>
                </h2>
            </li>
        </ul>
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
            isLoading: true,
            isEmpty: false,
            chosenCoupon: -1,
            coupons: []
        }
    },
    mixins: [getUserInfoMixin],
    methods: {
        setStartAt(t){
            return moment(t).format('YYYY/MM/DD')
        }
    },
    created(){
        this.$http.get('/api/coupon',{
            params: {
                coupons: JSON.stringify(this.userInfo.coupons)
            }
        }).then(res=>{
            this.isLoading =  false
            if(res.data.code == 0){
                this.coupons = res.data.data
            }else{
                this.coupons = []
                this.isEmpty = true
            }
        })
    }
}

</script>

<style lang="css">
.shop-coupons{ min-height: 100vh; box-sizing: border-box; background: #f7f8fa; overflow: hidden;}
.shop-coupons li{ margin: 12px 12px 0; padding: 15px 10px; background: #fff; border-radius: 8px; box-shadow: 0 0 4px 0 rgba(0,0,0,0.1); display: flex; align-items: center;}
.shop-coupons li h2 b{ font-size: 14px; display: block; flex: 1;}
.shop-coupons li h2 time{ font-size: 12px; font-weight: 500; color: #666;}
.shop-coupons li>div{ color: #ee0a24; text-align: center; white-space:pre-wrap; font-size: 12px; width: 130px;}
.shop-coupons li>div b{ font-size: 30px;}
.shop-coupons .van-loading{ margin: 100px auto 0; text-align: center;}
</style>
