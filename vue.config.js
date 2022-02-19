const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  outputDir: 'yyg_chatroom',
  runtimeCompiler: true,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  devServer: {
    open: true, // 是否自动打开浏览器页面
    port: 10010, // 端口地址
    https: false, // 使用https提供服务

    // string | Object 代理设置
    proxy: {
      '/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
    }
  },
}