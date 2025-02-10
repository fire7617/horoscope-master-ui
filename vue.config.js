'use strict'
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')

// 從 .env 取得 host，若未指定則預設為 '0.0.0.0'
const host = process.env.HOST || '0.0.0.0'
const version = '1.0.2'
const env = process.env.VUE_APP_MODE || process.env.NODE_ENV || 'development'

console.log(`當前設定的 host: ${host}`)
console.log(`當前版本號: ${version}`)
console.log(`當前環境: ${env}`)
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = process.env.VUE_APP_TITLE || 'Mivoo 後臺管理系統'

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
  // 如果你不需要生產環境的 source map，可以將其設置為 false 以加速生產環境構建。cd
  productionSourceMap: false,
  // webpack-dev-server 相關配置
  devServer: {
    // 監聽的主機與埠號，由 .env 取得或使用預設值
    host: process.env.HOST || '0.0.0.0',
    port: process.env.port || 1024,
    open: true,
    proxy: {
      // 條件：所有以 VUE_APP_BASE_API 開頭的請求都將被代理
      // 如果在 .env.development 中設定 VUE_APP_BASE_API 為 "/"
      // 那麼所有請求 URL 如 "/xxx" 都會符合這個條件
      [process.env.VUE_APP_BASE_API]: {
        // 代理的目標伺服器：從 .env 中取得，例如 https://startrips.net
        target: process.env.VUE_APP_API_URL,
        // changeOrigin: true 代表修改請求來源，讓目標伺服器以為請求是直接從它那邊來的，通常用在跨域的情況。
        changeOrigin: true,
        // pathRewrite 的作用是重寫（或過濾）URL 路徑：
        // 這裡的設定是將 URL 開頭符合 '^' + VUE_APP_BASE_API（也就是以 VUE_APP_BASE_API 為前綴）的部分移除，
        // 這樣轉發到目標伺服器的路徑就不包含這個前綴。
        // 例如：如果 VUE_APP_BASE_API 為 '/'，那麼 '^/' 表示移除開頭的 '/'，
        // 如果 VUE_APP_BASE_API 設定為 '/api'，則 '^/api' 會被移除。
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        },
        // 當發送請求前，就印出最終的代理目標 URL
        onProxyReq(proxyReq, req, res) {
          console.log(
            `Proxying request: ${process.env.VUE_APP_API_URL}${req.url}`
          );
        }
      }
    },
    // 此設定允許在某些情況下忽略 host 的檢查，避免一些限制問題
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json']
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
        'process.env.VERSION': JSON.stringify(version)
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
