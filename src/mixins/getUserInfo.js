export default {
    methods: {
        async getUserInfo(){
            if(this.$local.fetch('myshop').username){
                this.$http.get('/api/user',{
                    params: {
                        username: this.$local.fetch('myshop').username
                    }
                }).then(res=>{
                    this.$store.commit('setUser',res.data.data)
                })
            }
        }
    }
}
