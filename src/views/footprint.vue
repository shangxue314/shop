<template lang="html">
    <div class="goods shop-footprint">
        <van-cell :title="`共${userInfo.footprint.length}条记录`" :value="btnEditText" @click="editFoot" v-if="userInfo.footprint.length>0" />
        <van-empty image="search" description="还没有留下足迹哦，去逛逛吧" v-if="userInfo.footprint.length==0" />
        <div class="goods-list">
            <van-grid clickable :column-num="2">
                <van-grid-item @click="toGoods(item)" v-for="item in footprint" :key="item.info._id" :_id="item.info._id">
                    <img :src="item.info.pic" alt="item.info.name" class="pic">
                    <p>{{item.info.name}}</p>
                    <p>¥{{item.info.price}}</p>
                    <van-checkbox v-model="item.checked" v-show="!btnEdit"></van-checkbox>
                </van-grid-item>
            </van-grid>
        </div>
        <van-submit-bar button-text="删除" v-if="!btnEdit" @submit="delFoot">
            <van-checkbox v-model="isCheckedAll">全选</van-checkbox>
        </van-submit-bar>
    </div>
</template>

<script>
import Vue from 'vue'
import {Grid,GridItem,Dialog,Icon,Cell,Checkbox,SubmitBar,Empty} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(Grid).use(GridItem).use(Dialog).use(Icon).use(Cell).use(Checkbox).use(SubmitBar).use(Empty)

export default {
    data(){
        return {
            btnEdit: true,
            footprint: []
        }
    },
    mixins: [getUserInfoMixin],
    computed: {
        btnEditText(){
            return this.btnEdit ? '编辑':'完成'
        },
        // 是否全选
        isCheckedAll: {
            get(){
                return this.footprint.every(item=>item.checked)
            },
            set(newVal){
                this.footprint.forEach(item=>{
                    item.checked = newVal
                })
            }
        },
    },
    created(){
        let {username,footprint} = this.userInfo
        this.$http.get('/api/footprint',{
            params: {
                username,
                footprint
            }
        }).then(res=>{
            if(res.data.data){
                this.footprint = res.data.data.map(item=>({
                    checked: false,
                    info: item
                }))
            }
        })
    },
    methods: {
        // 编辑切换
        editFoot(){
            this.btnEdit = !this.btnEdit
        },
        // 删除
        delFoot(){
            let {username} = this.userInfo
            let delFootlist = this.footprint.filter(item=>item.checked)
            delFootlist = delFootlist.map(item=>item.info._id)
            this.$http.delete('/api/footprint',{
                data: {
                    username,
                    delFootlist
                }
            }).then(res=>{
                // 更新store中数据
                this.footprint = this.footprint.filter(item=>!item.checked)
                this.$store.commit('setUser',{
                    footprint: res.data.data
                })
            })
        },
        // 跳转商品页
        toGoods(item){
            if(this.btnEdit){
                this.$router.push({path: '/goods/'+item.info._id})
            }else{
                item.checked = !item.checked
            }
        }
    }
}
</script>

<style lang="css">
.goods{ padding-bottom: 50px;}
.goods-list{ position: relative;}
.goods-list .van-loading{ position: absolute; left: 50%; top: 100px; transform: translateX(-50%);}
.goods-list .pic{ width: 2.6rem; height: 2.6rem; display: block; margin: 0 auto;}
.goods-list .van-grid-item p{ font-size: .3rem; line-height: .5rem; text-align: center;}
.goods-list .van-grid-item p:last-of-type{ font-size: .36rem; color: #e4393c;}
.goods-focus img{ width: 100%; display: block;}
.super-nav .van-grid-item p{ margin-top: 8px;}
.shop-footprint .van-grid-item{ position: relative;}
.shop-footprint .van-grid-item .van-checkbox{ position: absolute; right: 10px; top: 10px;}
.shop-footprint .van-submit-bar__bar{ justify-content: space-between;}
.shop-footprint .van-hairline--top::after{ display: none;}
</style>
