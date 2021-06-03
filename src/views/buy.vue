<template lang="html">
    <div class="shop-buy">
        <!--收货地址-->
        <div class="shop-buy-address" @click="selAddress">
            <p>{{address.ress}}</p>
            <h2>{{address.detail}}</h2>
            <p>{{address.name}} {{address.tel}}</p>
            <van-icon name="arrow" />
        </div>
        <!--商品信息-->
        <div class="cart-item" v-for="item in cartlist" :key="item._id">
            <van-card :price="item.price+'.00'" :desc="item.brand" :title="item.name" :thumb="item.pic">
                <template #footer>
                    <van-stepper v-model="item.num" theme="round" button-size="20" @change="editSum(item)" />
                </template>
            </van-card>
        </div>
        <div class="hr"></div>
        <!--价格卡券-->
        <div class="shop-buy-info">
            <ul>
                <li>
                    <h3>商品金额</h3>
                    <span>¥{{totalPrice/100+'.00'}}</span>
                </li>
                <li>
                    <h3>运费</h3>
                    <span>¥0</span>
                </li>
                <li>
                    <h3>优惠券</h3>
                    <span>去选择</span>
                    <van-icon name="arrow" />
                </li>
                <li>
                    <h3>积分({{userInfo.score}})</h3>
                    <span>去选择</span>
                    <van-icon name="arrow" />
                </li>
                <li @click="popShow=true">
                    <h3>余额(¥{{userInfo.balance+'.00'}})</h3>
                    <span class="red" v-if="balanceSelect!='0'">-¥{{balanceSelect+'.00'}}</span>
                    <span v-else>去选择</span>
                    <van-icon name="arrow" />
                </li>
            </ul>
            <p>合计：<b>¥{{balanceSurplus+'.00'}}</b></p>
        </div>
        <div class="hr"></div>
        <!--购买按钮-->
        <van-submit-bar :price="balanceSurplus*100" button-text="提交订单" @submit="buySubmit" />

        <van-popup v-model="popShow" position="bottom" @click-overlay="popHide" @click-close-icon="popHide" closeable round>
            <h2>余额</h2>
            <div class="sel">
                <div>账户余额¥{{userInfo.balance+'.00'}}</div>
                <div><span v-show="balanceChecked">本单 已减¥{{balanceSelect+'.00'}}</span> <van-checkbox v-model="balanceChecked" checked-color="#ee0a24"></van-checkbox></div>
            </div>
            <div class="button">
                <van-button round block type="info" color="linear-gradient(to right,#ff6034,#ee0a24)" @click="useBalance">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,Stepper,SubmitBar,Icon,Popup,Button,Checkbox,Toast} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(Card).use(Stepper).use(SubmitBar).use(Icon).use(Popup).use(Button).use(Checkbox).use(Toast)
export default {
    data(){
        return {
            cartlist: [],
            address: {},
            popShow: false,
            balanceChecked: false,       // 余额选中状态
            isFixBalanceChecked: false,  // 固定余额选中(确定按钮确定)
            editRes: []     // 保存修改数量的购物车
        }
    },
    mixins: [getUserInfoMixin],
    watch: {
        userInfo: {
            deep: true,
            handler(newVal){
                // 处理收货地址address
                if(newVal.address){
                    let address = newVal.address.filter(item=>item.isDefault)[0]
                    this.address = {
                        name: address.name,
                        tel: address.tel,
                        detail: address.addressDetail,
                        ress: address.city == address.province ? address.city + address.county : address.city + address.province + address.county
                    }
                }
                this.getBuyGoods(newVal.username)
            }
        }
    },
    computed: {
        // 计算总价
        totalPrice(){
            let total = 0
            this.cartlist.forEach(item=>{
                total += item.price * 100 * item.num
            })
            return total
        },
        // 计算总件
        totalNum(){
            let num = 0
            this.cartlist.forEach(item=>{
                num += item.num
            })
            return num
        },
        // 余额使用数量
        balanceSelect(){
            if(this.balanceChecked){
                // 使用余额
                return this.userInfo.balance > this.totalPrice/100 ? this.totalPrice/100 : this.userInfo.balance
            }else{
                // 不使用
                return 0
            }
        },
        // 应付金额
        balanceSurplus(){
            return this.totalPrice/100 - this.balanceSelect
        }
    },
    created(){
        // 商品购买获取详情
        this.getBuyGoods(this.userInfo.username)
    },
    methods: {
        // 商品购买获取详情
        getBuyGoods(username){
            if(username){
                let cartlistid = this.$route.query.pid
                this.$http.get('/api/cart',{
                    params: {
                        username: username,
                        cartlist: cartlistid
                    }
                }).then(res=>{
                    this.cartlist = res.data.data
                    // 修改数量的购物车设置默认值
                    this.editRes = []
                    this.userInfo.cartlist.forEach(item=>{
                        this.editRes.push({id:item.id,num:item.num})
                    })
                })
            }
        },
        // 确定使用余额
        useBalance(){
            this.isFixBalanceChecked = this.balanceChecked
            this.popShow = false
        },
        // 关闭余额pop
        popHide(){
            this.balanceChecked = this.isFixBalanceChecked
        },
        // 选择收货地址
        selAddress(){
            this.$router.replace({
                path: '/addresslist'
            })
        },
        // 提交订单
        buySubmit(){
            if(this.balanceSelect==0){
                this.$toast('请使用余额支付');
            }else if(this.balanceSurplus>0){
                this.$toast('余额不足');
            }else{
                // 提交
                this.$http.post('/api/order',{
                    username: this.userInfo.username,
                    totalPrice: this.totalPrice/100,
                    cartlistid: this.$route.query.pid,
                    num: this.totalNum,
                    name: this.address.name,
                    tel: this.address.tel,
                    address: this.address.detail
                }).then(res=>{
                    this.$toast({
                        message: res.data.message,
                        onClose: ()=>{
                            if(res.data.code==0){
                                // 更新store中balance数据
                                this.$store.commit('setUser',{
                                    balance: res.data.data
                                })
                                // 跳转订单页
                                this.$router.replace('/order')
                            }
                        }
                    })
                })
            }
        },
        // 修改商品数量
        editSum(item){
            this.$http.put('/api/cart',{
                username: this.userInfo.username,
                goodsid: item._id,
                num: item.num
            }).then(res=>{
                this.editRes = res.data.data
            })
        }
    },
    beforeRouteEnter(to,from,next){
        // 修改收货地址
        next(vm=>{
            if(to.query.address){
                vm.$nextTick(()=>{
                    vm.address = to.query.address
                })
            }
        })
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
.shop-buy-address{ padding: 10px 20px; border-bottom: 2px dashed #eee; line-height: 22px; position: relative;}
.shop-buy-address h2{ font-size: 16px;}
.shop-buy-address p{ font-size: 12px; color: #666;}
.shop-buy-address .van-icon{ position: absolute; right: 10px; top: 50%; margin-top: -6px;}
.shop-buy-info{ padding: 10px 20px;}
.shop-buy-info li{ display: flex; justify-content: space-between; line-height: 24px; margin: 4px 0; position: relative;}
.shop-buy-info h3{ font-size: 12px; font-weight: 500; color: #666;}
.shop-buy-info span{ display: block;}
.shop-buy-info p{ border-top: 1px solid #eee; text-align: right; line-height: 24px; margin-top: 6px; padding-top: 6px;}
.shop-buy-info p b{ color: #ee0a24; font-size: 14px;}
.shop-buy-info .van-icon{ position: absolute; right: -12px; top: 50%; margin-top: -6px;}
.shop-buy .cart-item{ padding: 10px 0;}
.shop-buy .cart-item .van-card{ padding: 10px 20px;}
.shop-buy .cart-item .van-stepper{ right: 20px;}
.shop-buy .van-popup{ padding: 20px; box-sizing: border-box; min-height: 30%;}
.shop-buy .van-popup h2{ font-size: 16px; font-weight: 500;}
.shop-buy .van-popup .sel{ font-size: 12px; color: #666; display: flex; justify-content: space-between; margin-top: 20px; line-height: 20px;}
.shop-buy .van-popup .sel>div{ flex: auto; display: flex;}
.shop-buy .van-popup .sel>div:last-child{ justify-content: flex-end;}
.shop-buy .van-popup .sel .van-checkbox{ margin-left: 5px;}
.shop-buy .button{ width:100%; position: absolute; left: 0; bottom: 0; padding: 20px; box-sizing: border-box;}
.shop-buy .red{ color: #ee0a24;}
</style>
