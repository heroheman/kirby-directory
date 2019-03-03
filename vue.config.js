module.exports = {
  configureWebpack: {
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: false
    })
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  }
}
