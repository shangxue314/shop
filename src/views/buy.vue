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
                <li @click="couponShow=true">
                    <h3>优惠券</h3>
                    <span class="red" v-if="couponSelectPrice">-¥{{couponSelectPrice+'.00'}}</span>
                    <span v-else>去选择</span>
                    <van-icon name="arrow" />
                </li>
                <li @click="scoreShow=true">
                    <h3>积分({{userInfo.score}})</h3>
                    <span class="red" v-if="scoreSelect!='0'">-¥{{scoreSelect+'.00'}}</span>
                    <span v-else>去选择</span>
                    <van-icon name="arrow" />
                </li>
                <li @click="balanceShow=true">
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

        <!--使用积分弹窗-->
        <van-popup v-model="scoreShow" position="bottom" @click-overlay="scoreHide" @click-close-icon="scoreHide" closeable round>
            <h2>积分</h2>
            <div class="sel">
                <div>账户积分{{userInfo.score}}</div>
                <div><span v-show="scoreChecked">本单 已减¥{{scoreSelect+'.00'}}</span> <van-checkbox v-model="scoreChecked" checked-color="#ee0a24"></van-checkbox></div>
            </div>
            <div class="button">
                <van-button round block type="info" color="linear-gradient(to right,#ff6034,#ee0a24)" @click="useScore">确定</van-button>
            </div>
        </van-popup>

        <!--使用余额弹窗-->
        <van-popup v-model="balanceShow" position="bottom" @click-overlay="balanceHide" @click-close-icon="balanceHide" closeable round>
            <h2>余额</h2>
            <div class="sel">
                <div>账户余额¥{{userInfo.balance+'.00'}}</div>
                <div><span v-show="balanceChecked">本单 已减¥{{balanceSelect+'.00'}}</span> <van-checkbox v-model="balanceChecked" checked-color="#ee0a24"></van-checkbox></div>
            </div>
            <div class="button">
                <van-button round block type="info" color="linear-gradient(to right,#ff6034,#ee0a24)" @click="useBalance">确定</van-button>
            </div>
        </van-popup>

        <!-- 优惠券列表 -->
        <van-popup v-model="couponShow" position="bottom" closeable round>
            <van-coupon-list :coupons="coupons" :chosen-coupon="chosenCoupon" :disabled-coupons="disabledCoupons" @change="useCoupon" :show-exchange-bar="false" />
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import {Card,Stepper,SubmitBar,Icon,Popup,Button,Checkbox,Toast,CouponList,Dialog} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(Card).use(Stepper).use(SubmitBar).use(Icon).use(Popup).use(Button).use(Checkbox).use(Toast).use(CouponList).use(Dialog)
export default {
    data(){
        return {
            cartlist: [],                // 商品集合
            address: {},                 // 地址列表
            curAddress: {},              // 选中的地址
            couponShow: false,           // 显示优惠券弹窗
            coupons: [],                 // 可用优惠券列表
            disabledCoupons: [],         // 不可用优惠券列表
            sortlist: [],                // 优惠券商品分类
            chosenCoupon: -1,            // 选中优惠券的索引
            couponSelectPrice: '',       // 优惠券选中金额
            couponSelectId: '',          // 优惠券选中_id
            balanceShow: false,          // 显示账户余额弹窗
            balanceChecked: false,       // 余额选中状态
            isFixBalanceChecked: false,  // 固定余额选中(确定按钮确定)
            scoreShow: false,            // 显示账户积分弹窗
            scoreChecked: false,         // 积分选中状态
            isFixScoreChecked: false,    // 固定积分选中(确定按钮确定)
            editRes: []                  // 保存修改数量的购物车
        }
    },
    mixins: [getUserInfoMixin],
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
        // 积分使用数量
        scoreSelect(){
            if(this.scoreChecked){
                // 使用积分
                return this.userInfo.score > this.totalPrice/100 ? this.totalPrice/100 - this.couponSelectPrice : this.userInfo.score
            }else{
                // 不使用
                return 0
            }
        },
        // 余额使用数量
        balanceSelect(){
            if(this.balanceChecked){
                // 使用余额
                return this.userInfo.balance > this.totalPrice/100 ? this.totalPrice/100 - this.couponSelectPrice - this.scoreSelect : this.userInfo.balance
            }else{
                // 不使用
                return 0
            }
        },
        // 应付金额
        balanceSurplus(){
            return this.totalPrice/100 - this.couponSelectPrice - this.balanceSelect - this.scoreSelect
        }
    },
    async created(){
        // 修改数量的购物车设置默认值
        this.editRes = []
        this.userInfo.cartlist.forEach(item=>{
            this.editRes.push({id:item.id,num:item.num})
        })
        // 判断是否已完善收货地址
        if(this.userInfo.address.length==0){
            Dialog.alert({
                title: '登录提示',
                message: `请先完善收货地址资料再下单哦`,
            }).then(() => {
                // on confirm
                this.$router.replace({
                    path: '/config'
                })
            })
            return
        }
        // 处理收货地址address
        let address = this.userInfo.address.filter(item=>item.isDefault)[0]
        this.address = {
            name: address.name,
            tel: address.tel,
            detail: address.addressDetail,
            ress: address.city == address.province ? address.city + address.county : address.city + address.province + address.county
        }
        // 商品购买获取详情
        let cartlistid = this.$route.query.pid
        let cartlistRes = await this.$http.get('/api/cart',{
            params: {
                username: this.userInfo.username,
                cartlist: cartlistid
            }
        })
        this.cartlist = cartlistRes.data.data
        // 获取优惠券列表
        this.cartlist.forEach(item=>{
            this.sortlist.push(item.sort)
        })
        this.$http.get('/api/coupon',{
            params: {
                coupons: JSON.stringify(this.userInfo.coupons),
                sortlist: JSON.stringify(this.sortlist)
            }
        }).then(res=>{
            this.coupons = res.data.data.enable
            this.disabledCoupons = res.data.data.disable
        })
    },
    methods: {
        // 选择优惠券
        useCoupon(index){
            if(index==-1){
                // 点击不使用优惠券
                this.couponSelectPrice = ''
                this.couponSelectId = ''
                this.chosenCoupon = -1
            }else{
                // 使用优惠券
                this.chosenCoupon = index
                this.couponShow = false
                this.couponSelectPrice = this.coupons[index].value
                this.couponSelectId = this.coupons[index]._id
            }
            this.couponShow = false
        },
        // 确定使用余额
        useBalance(){
            this.isFixBalanceChecked = this.balanceChecked
            this.balanceShow = false
        },
        // 关闭余额pop
        balanceHide(){
            this.balanceChecked = this.isFixBalanceChecked
        },
        // 确定使用积分
        useScore(){
            this.isFixScoreChecked = this.scoreChecked
            this.scoreShow = false
        },
        // 关闭积分pop
        scoreHide(){
            this.scoreChecked = this.isFixScoreChecked
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
                    address: this.address.detail,
                    couponId: this.couponSelectId,
                    couponPrice: this.couponSelectPrice,
                    score: this.scoreSelect
                }).then(res=>{
                    this.$toast({
                        message: res.data.message,
                        onClose: ()=>{
                            if(res.data.code==0){
                                // 更新store中balance,coupons,score数据
                                let {balance,coupons,score} = res.data.data
                                this.$store.commit('setUser',{balance,coupons,score})
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
.shop-buy{ padding-bottom: 60px;}
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
.shop-buy .cart-item .van-card{ padding: 10px 20px;}
.shop-buy .cart-item .van-stepper{ right: 20px;}
.shop-buy .van-popup{ padding: 20px; box-sizing: border-box; min-height: 30%;}
.shop-buy .van-popup h2{ font-size: 16px; font-weight: 500;}
.shop-buy .van-popup .sel{ font-size: 12px; color: #666; display: flex; justify-content: space-between; margin-top: 20px; line-height: 20px;}
.shop-buy .van-popup .sel>div{ flex: auto; display: flex;}
.shop-buy .van-popup .sel>div:last-child{ justify-content: flex-end;}
.shop-buy .van-popup .sel .van-checkbox{ margin-left: 5px;}
.shop-buy .van-popup .van-coupon-list h2{ font-size: 24px;}
.shop-buy .button{ width:100%; position: absolute; left: 0; bottom: 0; padding: 20px; box-sizing: border-box;}
.shop-buy .red{ color: #ee0a24;}
</style>
