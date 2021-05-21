<template lang="html">
    <div class="cart">
        <van-empty image="search" description="购物车空空如也" v-if="getUser.cartlist.length==0" />
        <div class="cart-item" v-for="item in cartlist" :key="item._id" @click="cartChecked(item)">
            <van-swipe-cell>
                <van-checkbox v-model="item.checked"></van-checkbox>
                <van-card :num="item.sum" :price="item.info.price+'.00'" :desc="item.info.brand" :title="item.info.name" :thumb="item.info.pic"></van-card>
                <template #right>
                    <van-button square text="删除" type="danger" class="delete-button" @click="delPhone(item)" />
                </template>
            </van-swipe-cell>
        </div>
        <van-submit-bar :price="totalPrice" button-text="提交订单">
            <van-checkbox v-model="isCheckedAll">全选</van-checkbox>
            <template #tip>你的收货地址不支持同城送</template>
        </van-submit-bar>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,SubmitBar,Checkbox,Empty,SwipeCell} from 'vant'
Vue.use(Card).use(SubmitBar).use(Checkbox).use(Empty).use(SwipeCell)
export default {
    data(){
        return {
            checked: false,
            cartlist: []
        }
    },
    watch: {
        getUser: {
            deep: true,
            handler(newVal){
                this.getCartlist(newVal)
            }
        }
    },
    computed: {
        // 获取用户信息
        getUser(){
            return this.$store.state.user
        },
        // 是否全选
        isCheckedAll: {
            get(){
                return this.cartlist.every(item=>item.checked)
            },
            set(newVal){
                this.cartlist.forEach(item=>{
                    item.checked = newVal
                })
            }
        },
        // 计算总价
        totalPrice(){
            let num = 0
            this.cartlist.forEach(item=>{
                if(item.checked){
                    num += item.info.price * 100 * item.sum
                }
            })
            return num
        }
    },
    created(){
        this.getCartlist(this.getUser)
    },
    methods: {
        // 获取购物车中产品id列表，请求对应产品详情列表
        getCartlist(userInfo){
            if(userInfo.cartlist.length){
                let {cartlist} = userInfo
                // 统计每款商品数量
                let getSum = cartlist.reduce((pre,cur)=>{
                    pre[cur] = cur in pre ? pre[cur]+1 : 1
                    return pre
                },{})
                this.$http.get('/api/cart',{
                    params: {
                        cartlist: JSON.stringify(cartlist)
                    }
                }).then(res=>{
                    this.cartlist = res.data.data
                    this.cartlist = this.cartlist.map(item=>({
                        checked: false,
                        info: item,
                        sum: getSum[item._id]
                    }))
                })
            }
        },
        // 选中商品
        cartChecked(item){
            item.checked = !item.checked
        },
        // 删除商品
        delPhone(item){
            this.cartlist.splice(this.cartlist.indexOf(item),1)
            this.$http.delete('/api/cart',{
                data: {
                    username: this.getUser.username,
                    phoneid: item.info._id
                }
            }).then(res=>{
                // 更新store中数据
                this.$store.commit('setUser',{
                    cartlist: res.data.data
                })
            })
        }
    }
}
</script>

<style lang="css">
.cart-item{ position: relative;}
.cart-item .van-card{ padding-left: 30px;}
.cart-item .delete-button{ height: 100%;}
.cart-item .van-checkbox{ position: absolute; z-index: 5; left: 5px; top: 50%; margin-top: -10px;}
</style>
