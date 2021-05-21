<template lang="html">
    <div class="addphone">
        <h2>添加机型</h2>
        <ul>
            <li><input type="text" placeholder="手机型号" v-model="phone.name"></li>
            <li><input type="text" placeholder="手机品牌" v-model="phone.brand"></li>
            <li><input type="text" placeholder="手机内存" v-model="phone.memory"></li>
            <li><input type="text" placeholder="手机价格" v-model="phone.price"></li>
            <li><input type="text" placeholder="手机系统" v-model="phone.system"></li>
            <li><input type="text" placeholder="手机网络" v-model="phone.net"></li>
            <li><input type="text" placeholder="手机图片" v-model="phone.pic"></li>
            <li><input type="button" value="保存" @click="addPhone"></li>
            <!-- <li><input type="file" ref="file" @change="upFile"><input type="button" value="上传"></li> -->
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return {
            phone: {
                name: '',
                brand: '',
                memory: '',
                price: '',
                system: '',
                net: '',
                pic: ''
            }

        }
    },
    methods: {
        addPhone(){
            const phoneMap = ['手机型号','手机品牌','手机内存','手机价格','手机系统','手机网络','手机图片']
            let values = Object.values(this.phone)
            for(let i=0;i<values.length;i++){
                if(values[i]==''){
                    this.$toast('请添加'+phoneMap[i])
                    break
                }
            }
            if(values.every(item=>item!='')){
                this.$http.post('api/phone',this.phone).then(res=>{
                    this.$toast({
                        message: res.data.message,
                        onClose: ()=>{
                            if(res.data.code==0) this.$router.push('/')
                        }
                    })
                })
            }
        }
    }
}
</script>

<style lang="css">
.addphone{ padding: .2rem;}
.addphone h2{ font-size: .3rem;}
.addphone li{ margin-top: .3rem; overflow: hidden;}
.addphone li input{ width: 100%; height: .8rem; padding: 0 .1rem; box-sizing: border-box; border: 1px solid #eee; display: block; font-size: .24rem;}
.addphone li input[type=button]{ background: #e4393c; font-size: .3rem; color: #fff; border-color: #e4393c;}
</style>
