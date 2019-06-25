import Vue from 'vue'
import "@/utils/router/hooks";
import App from './App.vue'
import router from './router'
import AuthGuard from "./router/guard";
import "@/utils/validate/validate";

import moment from 'moment'
moment.locale('nl')
moment.weekdays(false)

import store from './store/index'

//partial import bulma, import global, import fonts
import "./sass/libraries/import_bulma.scss"
import './sass/fonts/fonts.scss'
import "./sass/global.scss"

import "../node_modules/tiny-slider/src/tiny-slider.scss"

Vue.use(AuthGuard, { router, store });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
