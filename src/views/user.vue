<template lang="html">
    <div class="user">
        <div class="user-info">
            <dl class="user-info-view">
                <dt><van-image width="1.2rem" height="1.2rem" round :src="userInfo.photo"/></dt>
                <dd>
                    <h2>{{userInfo.nickname}}<van-icon name="user-circle-o" :color="getSex" /></h2>
                    <p><van-tag type="primary" round color="#7232dd">积分:{{userInfo.score}}</van-tag></p>
                </dd>
            </dl>
            <van-grid :border="false" :column-num="3">
                <van-grid-item to="/fav">
                    <mark v-if="userInfo.favlist">{{userInfo.favlist.length}}</mark>
                    <p>商品收藏</p>
                </van-grid-item>
                <van-grid-item>
                    <mark>0</mark>
                    <p>店铺收藏</p>
                </van-grid-item>
                <van-grid-item>
                    <mark>0</mark>
                    <p>我的足迹</p>
                </van-grid-item>
            </van-grid>
            <div class="set">
                <van-icon name="setting-o" size="20" @click="toConfig" />
            </div>
        </div>
        <div class="user-data">
            <div class="user-data-view">
                <van-grid :border="false">
                    <van-grid-item icon="balance-list-o" text="待付款" />
                    <van-grid-item icon="todo-list-o" text="待收货" />
                    <van-grid-item icon="chat-o" text="退换/售后" />
                    <van-grid-item icon="orders-o" text="全部订单" />
                </van-grid>
            </div>
            <div class="user-data-view">
                <van-grid :border="false">
                    <van-grid-item>
                        <mark>0</mark>
                        <p>优惠券</p>
                    </van-grid-item>
                    <van-grid-item>
                        <mark>{{userInfo.score}}</mark>
                        <p>积分</p>
                    </van-grid-item>
                    <van-grid-item>
                        <mark>{{userInfo.balance}}</mark>
                        <p>余额</p>
                    </van-grid-item>
                    <van-grid-item icon="gold-coin-o" text="我的资产" />
                </van-grid>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {Grid,GridItem,Icon,Tag,Image} from 'vant'
Vue.use(Grid).use(GridItem).use(Icon).use(Tag).use(Image)
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
export default {
    data(){
        return{
        }
    },
    mixins: [getUserInfoMixin],
    computed: {
        // 计算性别
        getSex(){
            return this.userInfo.sex == '男' ? '#1989fa' : '#ee0a24'
        }
    },
    created(){

    },
    methods: {
        toConfig(){
            this.$router.push({
                path: '/config'
            })
        }
    }
}
</script>

<style lang="css">
.user{ background: #f7f7f7;}
.user-info{ padding: .5rem; position: relative; background: #fbe182;}
.user-info .set{ position: absolute; right: .5rem; top: .5rem; font-size: 12px;}
.user-info .van-grid-item{ font-size: 12px;}
.user-info .van-grid-item mark{ background: none; font-size: 20px;}
.user-info .van-grid-item__content{ background: none;}
.user-info-view{ display: flex; align-items: center;}
.user-info-view dt{ width: 1.2rem;}
.user-info-view dd{ flex: auto; padding-left: .3rem;}
.user-info-view dd h2{ font-size: 18px; font-weight: 500; margin-bottom: 4px;}
.user-info-view dd p{ font-size: 12px;}
.user-info-view .van-icon-user-circle-o{ font-size: .3rem; margin-left: .1rem;}
.user-data-view{ margin-bottom: 14px;}
.user-data-view mark{ background: none; font-size: 24px;}
</style>
