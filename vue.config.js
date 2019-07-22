module.exports = {
  publicPath: '',

  transpileDependencies: ['vue-swipe-actions'],

  pluginOptions: {
    i18n: {
      locale: 'nl',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    cordovaPath: 'src-cordova'
  },

  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({});

  },
}
