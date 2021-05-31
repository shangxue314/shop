<template lang="html">
    <div class="address">
        <van-address-edit :area-list="areaList" :address-info="AddressInfo" show-postal show-delete show-set-default :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" @delete="onDelete" :is-saving="saving" />
    </div>
</template>

<script>
import Vue from 'vue'
import {AddressEdit,Toast} from 'vant'
import getUserInfoMixin from '../mixins/getUserInfoMixin.js'
import { areaList } from '@vant/area-data';
Vue.use(AddressEdit).use(Toast)
export default {
    data(){
        return {
            areaList,            // vant地区列表
            AddressInfo: {},     // 初始地址数据
            aid: this.$route.params._id,     // 地址_id
            saving: false
        }
    },
    mixins: [getUserInfoMixin],
    created(){
        if(this.aid){
            // 获取编辑地址信息
            this.$http.get('/api/address/'+this.aid).then(res=>{
                this.AddressInfo = res.data.data.address[0]
            })
        }
    },
    methods: {
        // 保存
        onSave(content){
            this.saving = true
            if(this.aid){
                // 有aid为编辑
                this.$http.put('/api/address/'+this.aid,{
                    username: this.userInfo.username,
                    address: content
                }).then(res=>{
                    this.saving = false
                    this.$toast({
                        message: res.data.message,
                        onClose: ()=>{
                            if(res.data.code==0){
                                this.$store.commit('setUser',{address: res.data.data})
                                this.$router.replace('/addresslist')
                            }
                        }
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }else{
                // 没aid为新增
                this.$http.post('/api/address',{
                    username: this.userInfo.username,
                    address: content
                }).then(res=>{
                    this.saving = false
                    this.$toast({
                        message: res.data.message,
                        onClose: ()=>{
                            if(res.data.code==0){
                                this.$store.commit('setUser',{address: res.data.data})
                                this.$router.replace('/addresslist')
                            }
                        }
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        // 删除
        onDelete(){}
    }
}
</script>

<style lang="css">
</style>
