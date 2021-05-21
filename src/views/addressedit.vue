<template lang="html">
    <div class="address">
        <van-address-edit :area-list="areaList" show-postal show-delete show-set-default :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" @delete="onDelete" @change-detail="onChangeDetail"/>
    </div>
</template>

<script>
import Vue from 'vue'
import {AddressEdit,Toast} from 'vant'
import getUserInfoMixin from '../utils/getUserInfoMixin.js'
import { areaList } from '@vant/area-data';
Vue.use(AddressEdit).use(Toast)
export default {
    data(){
        return {
            areaList,        // vant地区列表
            AddressInfo: {   // 地址数据

            }
        }
    },
    mixins: [getUserInfoMixin],
    created(){

    },
    methods: {
        // 保存
        onSave(content){
            this.$http.post('/api/address',{
                username: this.userInfo.username,
                address: content
            }).then(res=>{
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
        },
        // 删除
        onDelete(){},
        onChangeDetail(val) {
            if(val){
                this.searchResult = [{
                    name: '京城雅居',
                    address: '朝阳区豆各庄'
                }]
            }else{
                this.searchResult = [];
            }
        }
    }
}
</script>

<style lang="css">
</style>
