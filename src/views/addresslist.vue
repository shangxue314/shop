<template lang="html">
    <div class="address">
        <van-address-list v-model="chosenAddressId" :list="userInfo.address" default-tag-text="默认" @add="onAdd" @edit="onEdit" />
    </div>
</template>

<script>
import Vue from 'vue'
import {AddressList,Toast} from 'vant'
import getUserInfoMixin from '../utils/getUserInfoMixin.js'
Vue.use(AddressList).use(Toast)
export default {
    data(){
        return {
            chosenAddressId: 0
        }
    },
    mixins: [getUserInfoMixin],
    methods: {
        // 新增地址
        onAdd(){
            this.$router.push({path: '/addressedit'})
        },
        onEdit(){}
    }
}
</script>

<style lang="css">
</style>
