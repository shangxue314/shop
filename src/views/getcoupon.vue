<template lang="html">
    <div class="shop-getcoupons">
        <van-empty description="暂无可以领取的优惠券" v-if="isEmpty" />
        <van-loading type="spinner" color="#e4393c" v-if="isLoading" />
        <ul>
            <li v-for="item in coupons" :key="item._id">
                <h2>
                    <b>{{item.name}}</b>
                    <time>{{formatDate(item.startAt)}}-{{formatDate(item.endAt)}}</time>
                </h2>
                <div>
                    <p><b>{{item.valueDesc}}</b>{{item.unitDesc}}</p>
                    <p v-html="item.condition"></p>
                    <van-button type="danger" size="small" round :disabled="item.geted" @click="receive(item)">{{item.geted?'已领取':'立即领取'}}</van-button>
                </div>
                <span class="geted" v-if="item.geted"></span>
            </li>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue'
import {Empty,Button,Loading} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
import moment from 'moment'
Vue.use(Empty).use(Button).use(Loading)
export default {
    data(){
        return {
            chosenCoupon: -1,
            coupons: [],
            isLoading: true,
            isEmpty: false
        }
    },
    mixins: [getUserInfoMixin],
    methods: {
        // 格式化日期
        formatDate(t){
            return moment(t).format('YYYY/MM/DD')
        },
        // 立即领取
        receive(coupon){
            this.$http.post('/api/coupon',{
                username: this.userInfo.username,
                couponId: coupon._id
            }).then(res=>{
                if(res.data.code==0){
                    this.$set(coupon,'geted',true)
                    coupon.geted = true
                    this.$store.commit('setUser',{
                        coupons: [coupon._id,...this.userInfo.coupons]
                    })
                }else{
                    this.$toast(res.data.message);
                }
            })
        }
    },
    created(){
        this.$http.get('/api/coupon',{
            params: {
                coupons: JSON.stringify(this.userInfo.coupons),
                getCoupons: true
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
.shop-getcoupons{ min-height: 100vh; box-sizing: border-box; background: #f7f8fa; overflow: hidden;}
.shop-getcoupons li{ margin: 12px 12px 0; background: #fff; border-radius: 8px; box-shadow: 0 0 4px 0 rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: space-between; position: relative;}
.shop-getcoupons li h2{ flex: 1; text-align: center;}
.shop-getcoupons li h2 b{ font-size: 18px; display: block;}
.shop-getcoupons li h2 time{ font-size: 12px; font-weight: 500; color: #666;}
.shop-getcoupons li>div{ background: #fff2ed; color: #ee0a24; text-align: center; white-space:pre-wrap; font-size: 12px; width: 130px; padding: 10px 0 15px;}
.shop-getcoupons li>div b{ font-size: 30px;}
.shop-getcoupons li>div .van-button{ margin-top: 5px;}
.geted{ content: ''; background: url(https://wq.360buyimg.com/wxsq_project/promote/couponcenter_m_v2/images/icon_received2_50480516.png) no-repeat; background-size: contain; width: 50px; height: 50px; position: absolute; top: 0; left: 5px;}
.shop-getcoupons .van-loading{ margin: 100px auto 0; text-align: center;}
</style>
