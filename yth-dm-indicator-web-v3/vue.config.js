/**
 * @format
 * @Author: wqsong2
 * @Date: 2023/7/12 11:52
 * @Description:配置文件
 */
/* eslint-disable */
const { defineConfig } = require('@vue/cli-service')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Happypack = require('happypack')
const os = require('os')
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length })
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
// 根据环境配置相对路径
const baseUrl = process.env.NODE_ENV === 'production' ? '/sqdj/registration' : ''
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  devServer: {
    port: 8080,
    hot: 'only', // 热更新替换，更新页面
    open: false,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
      ...require('./proxy.config')
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  css: {
    sourceMap: false, // 开启 CSS source maps
    loaderOptions: {
      scss: {
        additionalData: `$baseUrl: "${baseUrl}";`,
        additionalData: '@import "~@/assets/styles/base.scss";'
      },
      less: {
        additionalData: `$baseUrl: "${baseUrl}";`,
        globalVars: {
          hack: 'true; @import "~@/assets/styles/element.less";' // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/assets/styles/color.scss'),
      ]
    }
  },
  chainWebpack: (config) => {
    // 配置 svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module.rule("icons").test(/\.svg$/).include.add(resolve("src/icons")).end()
      .use("svg-sprite-loader").loader("svg-sprite-loader").options({
        symbolId: "icon-[name]",
      }).end();
    // 修复HMR
    config.resolve.symlinks(true)
    // 配置别名
    config.resolve.alias
      .set('$public', resolve('public'))
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@store', resolve('src/store'))
    // 引用vue-dompurify-html 代替v-html  防止xss攻击
    config.module.rule('js')
      .test(/\.m?jsx?$/)
      .exclude.clear() // exclude 优先级高于 include,
      .end()
      .include.add(
        path.resolve(__dirname, 'node_modules', 'vue-dompurify-html')
      )
    // 分离源码
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })
    // 代码压缩
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.devtool(false)
      config
        .plugin('scmp-compression')
        .use(require('compression-webpack-plugin'), [
          {
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.js$|\.html$|\.json$|\.css$|\.ttf$/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据进行压缩
            minRatio: 0.8, // 压缩率
            deleteOriginalAssets: false // 是否删除源文件
          }
        ])
    })
    // 多线程打包
    config.plugin('happypack').use(Happypack).tap((options) => {
      options[0] = {
        id: 'babel',
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happyThreadPool
      }
      return options
    })
    config.plugin('define').tap((args)=>{
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(true)
      return args
    })
    const hRule = config.module.rule('js')
    hRule.test(/\.js$/).include.add(resolve('src')).end()
    hRule.uses.clear()
    hRule.use('happypack/loader?id=babel').loader('happypack/loader?id=babel').end()
  },
  configureWebpack: (config) => {
    // 线上版本
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 移除console
      const plugins = [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: true
        })
      ]
      const splitChunksConfig = {
        cacheGroups: {
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: 1,
            chunks: 'initial',
            reuseExistingChunk: true
          },
          vendors: {
            name: 'chunk-vendors',
            test (module) {
              let path = module.resource
              if (!path) return true
              path = path.replace(/\\/g, '/')
              const isNeed =
                path &&
                /node_modules/.test(path) &&
                /node_modules\/(.)(?!pdfjs-dist)/.test(path)
              return isNeed
            },
            priority: 2,
            chunks: 'initial',
            minChunks: 2
          },
          element: {
            name: 'chunk-element',
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            chunks: 'initial',
            priority: 3,
            reuseExistingChunk: true
          },
          echarts5: {
            name: 'chunk-echarts5',
            test: /[\\/]node_modules[\\/]_?echarts5(.*)/,
            chunks: 'initial',
            priority: 3,
            reuseExistingChunk: true
          },
          moment: {
            name: 'chunk-moment',
            test: /[\\/]node_modules[\\/]_?moment(.*)/,
            chunks: 'initial',
            priority: 3,
            reuseExistingChunk: true
          }
        }
      }
      config.resolve = {
        ...config.resolve,
        fallback: { path: require.resolve('path-browserify') }
      }
      config.optimization.splitChunks = splitChunksConfig
      config.plugins = [...config.plugins, ...plugins]
    } else {
      // 为开发环境修改配置
      config.mode = 'development'
      config.resolve = {
        ...config.resolve,
        fallback: { path: require.resolve('path-browserify') }
      }
      // 多线程优化构建速度
      config.plugins.push(
        new Happypack({
          loaders: ['babel-loader', 'vue-loader'],
          threads: 30 // 线程数取决于你电脑性能的好坏，好的电脑建议开更多线程
        })
      )
    }
  }
})
/* eslint-disable no-new */
