const CompressionWebpackPlugin = require('compression-webpack-plugin')
const {HashedModuleIdsPlugin} = require('webpack')
const isProduction = process.env.NODE_ENV !== 'development'
// cdn链接，回插入到index.html中
const cdn = {
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        vant: 'vant',
        axios: 'axios'
    },
    css: ['https://cdn.jsdelivr.net/npm/vant@2.12.18/lib/index.css'],
    js: [
        'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
        'https://cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
        'https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js',
        'https://cdn.jsdelivr.net/npm/vant@2.12.18/lib/vant.min.js',
        'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js'
    ]
}
module.exports = {
    // publicPath: './',
    productionSourceMap: false, // 去除生产环境的SourceMap
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:54321',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
    chainWebpack: config=>{
        // 删除index中资源预加载
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
        // 图片压缩
        config.module.rule('images').use('image-webpack-loader').loader('image-webpack-loader').options({bypassOnDebug: true}).end()
        // 添加cdn参数到htmlWebpackPlugin配置中
        config.plugin('html').tap(args=>{
            if(isProduction) args[0].cdn = cdn
            return args
        })
    },
    configureWebpack: config=>{
        let plugins = []
        if(isProduction){
            // 只打包改变的文件
            plugins.push(
                new HashedModuleIdsPlugin()
            )
            // 打包时npm转CDN
            config.externals = cdn.externals
            // gzip压缩资源文件
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: /\.js$|\.json$|\.css/,
                    threshold: 10240,   // 大小大于该值的资源会被处理
                    minRatio: 0.8,      // 压缩率小雨该值的资源被处理
                    deleteOriginalAssets: false     // true删除源文件
                })
            )
            // 公共代码抽离
            // config.optimization = {
            //     splitChunks: {
            //         cacheGroups: {
            //             vendor: {
            //                 chunks: 'all',
            //                 test: /node_modules/,
            //                 name: 'vendor',
            //                 minChunks: 1,
            //                 maxInitialRequests: 5,
            //                 minSize: 0,
            //                 priority: 100
            //             },
            //             common: {
            //                 chunks: 'all',
            //                 test: /[\\/]src[\\/]js[\\/]/,
            //                 name: 'common',
            //                 minChunks: 2,
            //                 maxInitialRequests: 5,
            //                 minSize: 0,
            //                 priority: 60
            //             },
            //             styles: {
            //                 name: 'styles',
            //                 test: /\.(sa|sc|c)ss$/,
            //                 chunks: 'all',
            //                 enforce: true
            //             },
            //             runtimeChunk: {
            //                 name: 'manifest'
            //             }
            //         }
            //     }
            // }
        }
        return {plugins}
    }
}
