<template lang="html">
    <div class="address">
        <van-empty description="暂无地址" v-if="userInfo.address&&userInfo.address.length==0" />
        <van-address-list v-model="chosenAddressId" :list="userInfo.address" default-tag-text="默认" @add="onAdd" @edit="onEdit" @select="onSelect" />
    </div>
</template>

<script>
import Vue from 'vue'
import {AddressList,Toast,Empty} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
Vue.use(AddressList).use(Toast).use(Empty)
export default {
    data(){
        return {
            chosenAddressId: '0',
            pid: '',    // 当前购买商品id
            fromBuy: false  // 是否从购买页面跳转进入
        }
    },
    mixins: [getUserInfoMixin],
    methods: {
        // 新增地址
        onAdd(){
            this.$router.push({path: '/addressedit'})
        },
        // 编辑地址
        onEdit(item,index){
            this.$router.push({path: '/addressedit/'+this.userInfo.address[index]._id})
        },
        // 选中地址
        onSelect(item){
            item.id = item._id
            if(this.fromBuy){
                this.$router.replace({
                    path: '/buy',
                    query: {
                        pid: this.pid,
                        address: {
                            name: item.name,
                            tel: item.tel,
                            detail: item.addressDetail,
                            ress: item.address
                        }
                    }
                })
            }
        }
    },
    beforeRouteEnter(to,from,next){
        next(vm=>{
            if(from.name=='Buy'){
                vm.fromBuy = true
                vm.pid = from.query.pid
            }
        })
    }
}
</script>

<style lang="css">
</style>
