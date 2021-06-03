<template lang="html">
    <div class="cart">
        <van-empty image="search" description="购物车空空如也" v-if="getUser.cartlist.length==0" />
        <div class="cart-item" v-for="item in cartlist" :key="item._id">
            <van-swipe-cell>
                <van-checkbox v-model="item.checked"></van-checkbox>
                <van-card :price="item.info.price+'.00'" :desc="item.info.brand" :title="item.info.name" :thumb="item.info.pic" @click-thumb="cartChecked(item)">
                    <template #footer>
                        <van-stepper v-model="item.info.num" theme="round" button-size="20" @change="editSum(item)" />
                    </template>
                </van-card>
                <template #right>
                    <van-button square text="删除" type="danger" class="delete-button" @click="delGoods(item)" />
                </template>
            </van-swipe-cell>
        </div>
        <van-submit-bar :price="totalPrice" button-text="提交订单" v-if="getUser.cartlist.length!=0" @submit="buyGoods">
            <van-checkbox v-model="isCheckedAll">全选</van-checkbox>
        </van-submit-bar>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,SubmitBar,Checkbox,Empty,SwipeCell,Stepper} from 'vant'
Vue.use(Card).use(SubmitBar).use(Checkbox).use(Empty).use(SwipeCell).use(Stepper)

export default {
    data(){
        return {
            checked: false,
            cartlist: [],
            editRes: []     // 保存修改数量的购物车
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
                    num += item.info.price * 100 * item.info.num
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
            let {cartlist} = userInfo
            let cartlistid = cartlist.map(item=>item.id)
            this.$http.get('/api/cart',{
                params: {
                    username: this.getUser.username,
                    cartlist: JSON.stringify(cartlistid)
                }
            }).then(res=>{
                this.cartlist = res.data.data
                this.cartlist = this.cartlist.map(item=>({
                    checked: false,
                    info: item
                }))
                // 修改数量的购物车设置默认值
                cartlist.forEach(item=>{
                    this.editRes.push({id:item.id,num:item.num})
                })
            })
        },
        // 选中商品
        cartChecked(item){
            item.checked = !item.checked
        },
        // 删除商品
        delGoods(item){
            this.cartlist.splice(this.cartlist.indexOf(item),1)
            this.$http.delete('/api/cart',{
                data: {
                    username: this.getUser.username,
                    goodsid: item.info._id
                }
            }).then(res=>{
                this.editRes = res.data.data
            })
        },
        // 修改商品数量
        editSum(item){
            this.$http.put('/api/cart',{
                username: this.getUser.username,
                goodsid: item.info._id,
                num: item.info.num
            }).then(res=>{
                this.editRes = res.data.data
            })
        },
        // 购物车提交订单
        buyGoods(){
            if(this.cartlist.some(item=>item.checked)){
                let cartlistid = []
                this.cartlist.forEach(item=>{
                    if(item.checked){
                        cartlistid.push(item.info._id)
                    }
                })
                this.$router.push({
                    path: '/buy',
                    query: {pid: JSON.stringify(cartlistid)}
                })
            }
        }
    },
    // 离开页面时再提交mutation
    beforeRouteLeave(to,from,next){
        // 更新store中数据
        this.$store.commit('setUser',{
            cartlist: this.editRes
        })
        next()
    }
}
</script>

<style lang="css">
.cart-item{ position: relative;}
.cart-item .van-card{ padding-left: 30px; background: #fff;}
.cart-item .delete-button{ height: 100%;}
.cart-item .van-checkbox{ position: absolute; z-index: 5; left: 5px; top: 50%; margin-top: -10px;}
.cart-item .van-stepper{ position: absolute; z-index: 10; right: 12px; bottom: 10px;}
</style>
