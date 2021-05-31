module.exports = {
  publicPath: "",

  transpileDependencies: ["vue-swipe-actions", "vuex-persist"],

  pluginOptions: {
    i18n: {
      locale: "nl",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
    },
    cordovaPath: "src-cordova",
  },

  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader-corejs3")
      .loader("vue-svg-inline-loader-corejs3")
      .options({});
  },
};
