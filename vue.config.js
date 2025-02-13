'use strict'
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js 配置說明
//官方vue.config.js 參考文檔 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 這裡只列一部分，具體配置參考文檔
module.exports = {
  // 部署生產環境和開發環境下的URL。
  // 默認情況下，Vue CLI 會假設你的應用是被部署在一個域名的根路徑上
  // 例如 https://www.ruoyi.vip/。如果應用被部署在一個子路徑上，你就需要用這個選項指定這個子路徑。例如，如果你的應用被部署在 https://www.ruoyi.vip/admin/，則設置 baseUrl 為 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 在npm run build 或 yarn build 時 ，生成文件的目錄名稱（要和baseUrl的生產環境路徑一致）（默認dist）
  outputDir: 'dist',
  // 用於放置生成的靜態資源 (js、css、img、fonts) 的；（項目打包之後，靜態資源會放在這個文件夾下）
  assetsDir: 'static',
  // 是否開啟eslint保存檢測，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生產環境的 source map，可以將其設置為 false 以加速生產環境構建。
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" }
      }
    }
  },
  configureWebpack: {
    name: process.env.VUE_APP_TITLE,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解壓縮靜態文件
      new CompressionPlugin({
        cache: false,                   // 不啟用文件緩存
        test: /\.(js|css|html)?$/i,     // 壓縮文件格式
        filename: '[path].gz[query]',   // 壓縮後的文件名
        algorithm: 'gzip',              // 使用gzip壓縮
        minRatio: 0.8                   // 壓縮率小於1才會壓縮
      }),
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(process.env.npm_package_version)
      })
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single'),
          {
             from: path.resolve(__dirname, './public/robots.txt'), //防爬蟲文件
             to: './' //到根目錄下
          }
        }
      )
  }
}