<template lang="html">
    <div class="addgoods">
        <van-form @submit="addGoods">
            <van-field v-model="goods.name" name="型号" placeholder="型号" autocomplete="new-password" :rules="[{ required: true, message: '请填写商品型号' }]"/>
            <van-field v-model="goods.brand" name="品牌" placeholder="品牌" autocomplete="new-password" :rules="[{ required: true, message: '请填写商品品牌' }]"/>
            <van-field v-model="goods.price" name="价格" placeholder="价格" autocomplete="new-password" :rules="[{ required: true, message: '请填写商品价格' }]"/>
            <van-field v-model="goods.pic" name="图片" placeholder="图片" autocomplete="new-password" :rules="[{ required: true, message: '请填写图片地址' }]"/>
            <van-field :value="goods.sort" name="picker" placeholder="点击选择分类" @click="showFun('sorts')" readonly clickable :rules="[{ required: true, message: '' }]" />
            <template v-if="goods.sort=='手机'">
                <van-field :value="goods.fun" name="picker" placeholder="点击选择特色" @click="showFun('phone')" readonly clickable :rules="[{ required: true, message: '' }]" />
                <van-field v-model="goods.info.memory" name="手机内存" placeholder="手机内存" autocomplete="new-password" :rules="[{ required: true, message: '请填写手机内存' }]"/>
                <van-field v-model="goods.info.system" name="手机系统" placeholder="手机系统" autocomplete="new-password" :rules="[{ required: true, message: '请填写商品品牌' }]"/>
                <van-field v-model="goods.info.net" name="手机网络" placeholder="手机网络" autocomplete="new-password" :rules="[{ required: true, message: '请填写手机网络' }]"/>
            </template>
            <template v-else-if="goods.sort=='电脑'">
                <van-field :value="goods.fun" name="picker" placeholder="点击选择类型" @click="showFun('computer')" readonly clickable :rules="[{ required: true, message: '' }]" />
                <van-field v-model="goods.info.screen" name="屏幕尺寸" placeholder="屏幕尺寸" autocomplete="new-password" :rules="[{ required: true, message: '请填写屏幕尺寸' }]"/>
                <van-field v-model="goods.info.cpu" name="处理器" placeholder="处理器" autocomplete="new-password" :rules="[{ required: true, message: '请填写电脑处理器' }]"/>
                <van-field v-model="goods.info.memory" name="电脑内存" placeholder="电脑内存" autocomplete="new-password" :rules="[{ required: true, message: '请填写电脑内存大小' }]"/>
                <van-field v-model="goods.info.disk" name="电脑硬盘" placeholder="电脑硬盘" autocomplete="new-password" :rules="[{ required: true, message: '请填写电脑硬盘大小' }]"/>
                <van-field v-model="goods.info.grap" name="显卡型号" placeholder="显卡型号" autocomplete="new-password" :rules="[{ required: true, message: '请填写显卡型号' }]"/>
                <van-field v-model="goods.info.system" name="操作系统" placeholder="操作系统" autocomplete="new-password" :rules="[{ required: true, message: '请填写电脑操作系统' }]"/>
                <van-field v-model="goods.info.color" name="电脑颜色" placeholder="电脑颜色" autocomplete="new-password" :rules="[{ required: true, message: '请填写电脑颜色' }]"/>
            </template>
            <div class="add-btn">
                <van-button round block type="info" native-type="submit" color="linear-gradient(to right,#ff6034,#ee0a24)">保存</van-button>
            </div>
        </van-form>
        <van-popup v-model="showSort" position="bottom">
            <van-picker show-toolbar :columns="columns" @confirm="onSortConfirm" @cancel="showSort=false" />
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import {Form,Field,Button,Toast,Popup,Picker} from 'vant'
Vue.use(Form).use(Field).use(Button).use(Toast).use(Popup).use(Picker)
export default {
    data(){
        return {
            goods: {
                name: '',
                brand: '',
                fun: '',
                sort: '',
                price: '',
                pic: '',
                info: {}
            },
            sorts: ['手机','电脑'],
            phone: ['颜值控','拍照手机','旗舰手机'],
            computer: ['笔记本','平板电脑','一体机','组装电脑','商务电脑','游戏台式机'],
            columns: [],
            field: '',
            showSort: false
        }
    },
    methods: {
        // 保存
        addGoods(){
            this.$http.post('api/goods',this.goods).then(res=>{
                this.$toast({
                    message: res.data.message,
                    onClose: ()=>{
                        if(res.data.code==0) this.$router.push('/')
                    }
                })
            })
        },
        // 确认选择分类
        onSortConfirm(value){
            this.goods.fun = ''
            this.goods[this.field] = value
            this.showSort = false
        },
        showFun(key){
            this.columns = this[key]
            this.field = key === 'sorts' ? 'sort' : 'fun'
            this.showSort = true
        }
    }
}
</script>

<style lang="css">
.addgoods{ padding-bottom: 50px;}
.add-btn{ padding: 16px;}
</style>
