<template lang="html">
    <div class="login">
        <van-form @submit="onSubmit">
            <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名" autocomplete="new-password" :rules="[{ required: true, message: '请填写用户名' }]"/>
            <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" autocomplete="new-password" :rules="[{ required: true, message: '请填写密码' }]"/>
            <van-field v-model="repassword" type="password" name="密码" label="密码" placeholder="确认密码" autocomplete="new-password" :rules="[{ required: true, message: '请再次填写密码'},{validator, message: '确认密码不一致'}]"/>
            <van-button round block type="info" native-type="submit" color="linear-gradient(to right,#ff6034,#ee0a24)">注册</van-button>
        </van-form>
    </div>
</template>

<script>
import Vue from 'vue'
import {Form,Field,Button,Toast} from 'vant'
Vue.use(Form).use(Field).use(Button).use(Toast)
import Des from '../utils/des.js'
export default {
    data(){
        return {
            username: '',
            password: '',
            repassword: ''
        }
    },
    methods: {
        onSubmit(){
            this.$http.post('/api/sign',{
                username: this.username,
                password: Des.Encrypt(this.password)
            }).then(res=>{
                this.$toast({
                    message: res.data.message,
                    onClose: ()=>{
                        if(res.data.code==0){
                            // 注册成功
                            this.$router.replace('/login')
                        }
                    }
                })
            }).catch(err=>{
                console.log(err);
            })
        },
        // 两次输入密码校验函数返回 true 表示校验通过，false 表示不通过
        validator(val) {
            return this.password === val
        }
    }
}
</script>

<style lang="css">
.login{ padding: 20px;}
.login input{ box-shadow: 0 0 0px 1000px white inset;}
.login .van-button{ margin-top: 20px;}
</style>
