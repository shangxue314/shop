export default {
    data(){
        return {
            userInfo: {}
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
        }
    },
    created(){
        this.getUserInfo(this.getUser)
    },
    methods: {
        getUserInfo(data){
            this.userInfo = Object.assign({},this.userInfo,data)
        }
    }
}
