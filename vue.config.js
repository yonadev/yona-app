module.exports = {
  transpileDependencies: ['vue-swipe-actions'],
  pluginOptions: {
    i18n: {
      locale: 'nl',             // The locale of project localization
      fallbackLocale: 'en',     // The fallback locale of project localization
      localeDir: 'locales',     // The directory where store localization messages of project
      enableInSFC: false        // Enable locale messages in Single file components
    }
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({});

  }
};