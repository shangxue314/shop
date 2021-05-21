<template lang="html">
    <div class="config">
        <van-field label="头像" readonly clickable right-icon="arrow" class="photo" @click="showPhoto=true" >
            <template #input>
                <van-image width="1.2rem" height="1.2rem" round :src="userInfo.photo"/>
            </template>
        </van-field>
        <van-field label="用户名" class="username" v-model="userInfo.username" input-align="right" readonly />
        <van-field label="昵称" v-model="userInfo.nickname" input-align="right" right-icon="arrow" @blur="setNickname" />
        <van-field label="性别" v-model="userInfo.sex" input-align="right" readonly clickable @click="showSex=true" right-icon="arrow" />
        <van-field label="出生日期" v-model="userInfo.birth" input-align="right" readonly clickable @click="showBirth=true" right-icon="arrow" />
        <van-field label="收货地址" readonly clickable right-icon="arrow" @click="$router.push({path: '/addresslist'})" />
        <!--性别选择-->
        <van-popup v-model="showSex" round position="bottom">
            <van-picker title="选择性别" :columns="sex" show-toolbar @cancel="showSex=false" @confirm="onConfirmSex"></van-picker>
        </van-popup>
        <!--生日选择-->
        <van-popup v-model="showBirth" round position="bottom">
            <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="showBirth=false" @confirm="onConfirmBirth"></van-datetime-picker>
        </van-popup>
        <!--头像选择-->
        <van-popup v-model="showPhoto" round position="bottom">
            <van-uploader :after-read="afterRead" accept="image/jpeg,image/jpg,image/png">
                <van-button icon="plus" block>上传文件</van-button>
            </van-uploader>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import {Field,Icon,Image,Picker,Popup,DatetimePicker,Uploader,Button,Toast} from 'vant'
Vue.use(Icon).use(Image).use(Field).use(Picker).use(Popup).use(DatetimePicker).use(Uploader).use(Button).use(Toast)
export default {
    data(){
        return{
            userInfo: {},
            sex: ['男','女'],
            showSex: false,
            minDate: new Date(1900, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(),
            showBirth: false,
            showPhoto: false
        }
    },
    watch: {
        // 刷新页面时监听用户信息的变化
        getUser: {
            deep: true,
            handler(newVal){
                this.getUserInfo(newVal)
            }
        }
    },
    computed: {
        // 获取store中用户信息
        getUser(){
            return this.$store.state.user
        },
        // 计算性别
        getSex(){
            return this.userInfo.sex == '男' ? '#1989fa' : '#ee0a24'
        }
    },
    created(){
        this.getUserInfo(this.$store.state.user)
    },
    methods: {
        getUserInfo(data){
            this.userInfo = Object.assign({},this.userInfo,data)
        },
        // 确认选择性别
        onConfirmSex(value){
            this.userInfo.sex = value;
            this.showSex = false;
            this.$http.put('/api/sex',{
                username: this.userInfo.username,
                sex: this.userInfo.sex
            }).then(res=>{
                this.$toast(res.data.message)
                // 同步更新store中数据
                this.$store.commit('setUser',{sex: this.userInfo.sex})
            })
        },
        // 确认选择生日
        onConfirmBirth(value){
            this.userInfo.birth = this.formatDate(value);
            this.showBirth = false;
            this.$http.put('/api/birth',{
                username: this.userInfo.username,
                birth: this.userInfo.birth
            }).then(res=>{
                this.$toast(res.data.message)
                // 同步更新store中数据
                this.$store.commit('setUser',{birth: this.userInfo.birth})
            })
        },
        // 格式化日期
        formatDate(date){
            return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
        },
        // 图片上传
        afterRead(file){
            Toast.loading('上传中')
            var formData = new FormData();
            //此处文件名必须为 singleFile ，因为后台设置仅接口此文件名
            formData.append('singleFile', file.file);
            formData.append('username', this.userInfo.username);
            this.$http.post('/api/single',formData).then(res=>{
                // 处理返回的图片路径去掉public/
                this.userInfo.photo = res.data.data.path
                Toast.clear()
                this.showPhoto = false
                // 同步更新store中数据
                this.$store.commit('setUser',{photo: res.data.data.path})
            })
        },
        // 更新昵称
        setNickname(){
            this.$http.put('/api/nickname',{
                username: this.userInfo.username,
                nickname: this.userInfo.nickname
            }).then(res=>{
                this.$toast(res.data.message)
                // 同步更新store中数据
                this.$store.commit('setUser',{nickname: this.userInfo.nickname})
                // 同步更新localstorage中数据
                this.$local.save('myshop',{
                    nickname: res.data.data.nickname
                })
            })
        }
    }
}
</script>

<style lang="css">
.username .van-field__body{ padding-right: .5rem;}
.photo .van-field__control--custom{ justify-content: flex-end;}
.config .van-uploader,.config .van-uploader__input-wrapper{ width: 100%;}
</style>
