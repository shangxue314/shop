<template lang="html">
    <div class="detail">
        <img :src="phone.pic" alt="phone.name">
        <template v-if="!isModify">
            <p>手机型号：{{phone.name}}</p>
            <p>手机品牌：{{phone.brand}}</p>
            <p>手机内存：{{phone.memory}}</p>
            <p>手机价格：¥{{phone.price}}</p>
            <p>手机系统：{{phone.system}}</p>
            <p>手机网络：{{phone.net}}</p>
            <p><input type="button" value="修改" @click="modifyPhone"></p>
        </template>
        <template v-else>
            <p>手机型号：<input type="text" placeholder="手机型号" v-model="phone.name"></p>
            <p>手机品牌：<input type="text" placeholder="手机品牌" v-model="phone.brand"></p>
            <p>手机内存：<input type="text" placeholder="手机内存" v-model="phone.memory"></p>
            <p>手机价格：<input type="text" placeholder="手机价格" v-model="phone.price"></p>
            <p>手机系统：<input type="text" placeholder="手机系统" v-model="phone.system"></p>
            <p>手机网络：<input type="text" placeholder="手机网络" v-model="phone.net"></p>
            <p><input type="button" value="保存" @click="putPhone"></p>
        </template>
        <van-goods-action>
            <van-goods-action-icon to="/cart" icon="cart-o" text="购物车" :badge="getBadge" />
            <van-goods-action-icon :icon="isComFav.icon" :text="isComFav.text" :color="isComFav.color" @click="addFav" />
            <van-goods-action-button type="warning" text="加入购物车" @click="addCart" />
            <van-goods-action-button type="danger" text="立即购买" />
        </van-goods-action>
    </div>
</template>

<script>
import Vue from 'vue'
import {GoodsAction,GoodsActionIcon,GoodsActionButton} from 'vant'
Vue.use(GoodsAction)
Vue.use(GoodsActionIcon)
Vue.use(GoodsActionButton)
export default {
    data(){
        return {
            phone: {},
            isModify: false,
            isFav: false,
            pid: this.$route.params._id
        }
    },
    created(){
        // 获取商品详情
        this.$http.get('/api/phones/'+this.pid).then(res=>{
            this.phone = res.data.data
        })
        // 从store中判断商品是否已收藏
        if(this.getUser.favlist){
            this.setIsFav(this.getUser)
        }
        console.log(this.getUser);
    },
    watch: {
        // 刷新页面时监听用户信息的变化
        getUser: {
            deep: true,
            handler(newVal){
                this.setIsFav(newVal)
            }
        }
    },
    computed: {
        // 获取store中用户信息
        getUser(){
            return this.$store.state.user
        },
        // 是否收藏
        isComFav(){
            return {
                icon: this.isFav?'like':'like-o',
                text: this.isFav?'已收藏':'收藏',
                color: this.isFav?'#ee0a24':''
            }
        },
        // 统计购物车商品数量
        getBadge(){
            return this.$store.state.user.cartlist.length ? this.$store.state.user.cartlist.length : ''
        }
    },
    methods: {
        modifyPhone(){
            this.isModify = true
        },
        // 设置收藏状态
        setIsFav(data){
            this.isFav = data.favlist.includes(this.pid)?true:false
        },
        // 更新详情
        putPhone(){
            this.$http.put('/api/phones/'+this.pid,this.phone).then(res=>{
                this.$toast({
                    message: res.data.message,
                    onClose: ()=>{
                        if(res.data.code==0) this.$router.push('/')
                    }
                })
            })
        },
        // 加入购物车
        addCart(){
            this.$http.post('/api/cart',{
                username: this.getUser.username,
                phoneid: this.pid
            }).then(res=>{
                this.$store.commit('setUser',{
                    cartlist: res.data.data
                })
            })
        },
        // 加入收藏
        addFav(){
            this.$http.post('/api/fav',{
                username: this.getUser.username,
                phoneid: this.pid
            }).then(res=>{
                this.isFav = res.data.data.includes(this.pid)?true:false
                this.$store.commit('setUser',{
                    favlist: res.data.data
                })
            })
        }
    }
}
</script>

<style lang="css">
.detail{ overflow: auto;}
.detail>img{ width: 4rem; display: block; margin: 1rem auto;}
.detail p{ font-size: .3rem; line-height: .5rem; padding: 0 1rem; display: flex; align-items: center; margin-top: .1rem;}
.detail input[type=text]{ border: 1px solid #eee; font-size: .3rem; height: .4rem; display: block; flex: auto; padding-left: .1rem;}
.detail input[type=button]{ display: block; background: #ddd; font-size: .3rem; width: 100%; height: .6rem; border: none; margin-top: .2rem; text-decoration: none; text-align: center; color: #333;}
.detail .van-goods-action{ z-index: 10000;}
</style>
