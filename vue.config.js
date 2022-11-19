const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  //配置代理跨域
  devServer: {
    proxy: 'http://toutiao.itheima.net/'//请求地址
  }
})
