import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//partial import bulma
import "./sass/import_bulma.scss"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
