const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

module.exports = {
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 3000
  },
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  runtimeCompiler: false,
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    } else {

    }
  }
}