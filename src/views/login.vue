<template lang="html">
    <div class="login">
        <van-form @submit="onSubmit">
            <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]"/>
            <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" :rules="[{ required: true, message: '请填写密码' }]"/>
            <van-button round block type="info" native-type="submit" color="linear-gradient(to right,#ff6034,#ee0a24)">提交</van-button>
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
            password: ''
        }
    },
    methods: {
        onSubmit(){
            this.$http.post('/api/login',{
                username: this.username,
                password: Des.Encrypt(this.password)
            }).then(res=>{
                this.$toast({
                    message: res.data.message,
                    onClose: ()=>{
                        if(res.data.code==0){
                            // 登录成功
                            this.$local.save('myshop',{
                                nickname: res.data.data.nickname,
                                username: res.data.data.username
                            })
                            this.$http.get('/api/user',{
                                params: {
                                    username: this.username
                                }
                            }).then(res=>{
                                this.$store.commit('setUser',res.data.data)
                            })
                            // 登录成功后跳转页面，使用replace替换登录页的历史记录，避免返回上一页时再返回登录页
                            this.$router.replace('/'+this.$route.query.redirect)
                        }
                    }
                })
            }).catch(err=>{
                console.log(err);
            })
        }
    }
}
</script>

<style lang="css">
.login{ padding: 20px;}
.login input{ box-shadow: 0 0 0px 1000px white inset;}
.login .van-button{ margin-top: 20px;}
</style>
