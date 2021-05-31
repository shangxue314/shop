<template lang="html">
    <div class="shop-sort">
        <van-sidebar v-model="active" @change="changeSort">
            <van-sidebar-item v-for="item in sort" :title="item.title" :key="item.id" />
        </van-sidebar>
        <div class="shop-sort-content">
            <div v-for="item in sort[active].children" :key="item.field">
                <h2>{{item.subtit}}</h2>
                <van-grid :column-num="3" :border="false" :square="true">
                    <van-grid-item v-for="value in item.list" :key="value.name" :to="{path: `/search?sort=${sort[active].title}&${item.field}=${value.name}`}">
                        <van-image :src="value.img" width="70" />
                        {{value.name}}
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {Sidebar,SidebarItem,Image} from 'vant'
Vue.use(Sidebar).use(SidebarItem).use(Image)

export default {
    data(){
        return {
            active: 0,
            sort: [
                {
                    title: '手机',
                    field: 'sort',
                    id: 1,
                    children: [
                        {
                            subtit: '热门品牌',
                            field: 'brand',
                            list: [
                                {
                                    img: 'https://img13.360buyimg.com/focus/s140x140_jfs/t11509/131/2348573811/3425/4f20fe6/5a16925aN8a6dfd03.png',
                                    name: '三星'
                                },
                                {
                                    img: 'https://img14.360buyimg.com/focus/s140x140_jfs/t11929/135/2372293765/1396/e103ec31/5a1692e2Nbea6e136.jpg',
                                    name: '华为'
                                },
                                {
                                    img: 'https://img30.360buyimg.com/focus/s140x140_jfs/t13411/188/926813276/3945/a4f47292/5a1692eeN105a64b4.png',
                                    name: '小米'
                                },
                                {
                                    img: 'https://img20.360buyimg.com/focus/s140x140_jfs/t13759/194/897734755/2493/1305d4c4/5a1692ebN8ae73077.jpg',
                                    name: '苹果'
                                },
                                {
                                    img: 'https://img10.360buyimg.com/focus/s140x140_jfs/t12178/348/911080073/4732/db0ad9c7/5a1692e2N6df7c609.jpg',
                                    name: '荣耀'
                                },
                                {
                                    img: 'https://img11.360buyimg.com/focus/s140x140_jfs/t11014/359/2341377211/2777/1755c29c/5a169244Nff0179e0.png',
                                    name: 'vivo'
                                }
                            ]
                        },
                        {
                            subtit: '手机特色',
                            field: 'fun',
                            list: [
                                {
                                    img: 'https://img13.360buyimg.com/focus/s140x140_jfs/t1/109596/11/7650/2742/5e5f1074E76a2364e/09b2b19f13691c60.jpg',
                                    name: '颜值控'
                                },
                                {
                                    img: 'https://img30.360buyimg.com/focus/s140x140_jfs/t18955/187/1309277884/11517/fe100782/5ac48d27N3f5bb821.jpg',
                                    name: '拍照手机'
                                },
                                {
                                    img: 'https://img10.360buyimg.com/focus/s140x140_jfs/t11503/241/2246064496/4783/cea2850e/5a169216N0701c7f1.jpg',
                                    name: '旗舰手机'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '电脑',
                    field: 'sort',
                    id: 2,
                    children: [
                        {
                            subtit: '电脑整机',
                            field: 'fun',
                            list: [
                                {
                                    img: 'https://img30.360buyimg.com/focus/s140x140_jfs/t11155/36/2330310765/10690/eb6754c3/5a17ba96N49561fea.png',
                                    name: '笔记本'
                                },
                                {
                                    img: 'https://img10.360buyimg.com/focus/s140x140_jfs/t13252/193/948884668/3832/2cd704d4/5a17b918N0785e503.jpg',
                                    name: '平板电脑'
                                },
                                {
                                    img: 'https://img12.360buyimg.com/focus/s140x140_jfs/t14020/291/987624955/9068/5b27e263/5a17b978N2a93f7a9.jpg',
                                    name: '一体机'
                                },
                                {
                                    img: 'https://img10.360buyimg.com/focus/s140x140_jfs/t14101/325/978287093/8836/e142aa53/5a17ba73N07b12f0c.jpg',
                                    name: '组装电脑'
                                },
                                {
                                    img: 'https://img10.360buyimg.com/focus/s140x140_jfs/t13138/231/1001350583/7486/6d001868/5a17b94eN820f6506.jpg',
                                    name: '商务电脑'
                                },
                                {
                                    img: 'https://img20.360buyimg.com/focus/s140x140_jfs/t12901/167/947504038/6315/4c239386/5a17b948Nf6918c9e.jpg',
                                    name: '游戏台式机'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        changeSort(index){
            this.active = index
        }
    }
}
</script>

<style lang="css">
.shop-sort{ display: flex;}
.shop-sort .van-sidebar{ height: auto;}
.shop-sort-content{ flex: 1;}
.shop-sort-content h2{ font-size: 16px; padding: 10px; margin-top: 10px;}
</style>
