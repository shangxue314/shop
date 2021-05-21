<template lang="html">
    <div class="phones">
        <div class="phones-focus">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="item,index in focus" :key="index">
                    <img :src="item">
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="phones-list">
            <van-grid clickable :column-num="2">
                <van-grid-item :to="{path:'/phone/'+item._id}" v-for="item in phonelist" :key="item._id" :_id="item._id">
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
import {Grid,GridItem,Swipe,SwipeItem} from 'vant'
Vue.use(Grid).use(GridItem).use(Swipe).use(SwipeItem)

export default {
    data(){
        return {
            phonelist: [],
            focus: ['https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/167245/17/13432/149823/60540ceeE0a928512/677088217d8a00aa.jpg!cr_1053x420_4_0!q70.jpg.dpg','https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/46777/1/12220/196152/5d94a748E3a3d58cc/9d40c5ebd23f9d9c.jpg!cr_1125x449_0_166!q70.jpg.dpg','https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/167665/22/18178/218725/60765755Ed648e528/f1b06e1c7d249c03.jpg!cr_1125x449_0_166!q70.jpg.dpg']
        }
    },
    created(){
        this.$http.get('/api/phones').then(res=>{
            this.phonelist = res.data.data
        })
    }
}
</script>

<style lang="css">
.phones{ padding-bottom: 50px;}
.phones-list .pic{ width: 3rem; height: 3rem; display: block; margin: 0 auto;}
.phones-list .van-grid-item p{ font-size: .3rem; line-height: .5rem; text-align: center;}
.phones-list .van-grid-item p:last-of-type{ font-size: .36rem; color: #e4393c;}
.phones-focus img{ width: 100%; display: block;}
</style>
