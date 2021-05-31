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
            chosenAddressId: '0'
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
        }
    }
}
</script>

<style lang="css">
</style>
