import Vue from 'vue'
import "@/utils/router/hooks";
import App from './App.vue'
import router from './router'
import AuthGuard from "./router/guard";
import "@/utils/validate/validate";
import i18n from '@/utils/i18n'

import moment from 'moment'
moment.locale('nl')
moment.weekdays(false)

import store from './store/index'

Vue.directive('fixed-scroll', {
  inserted: function (el, binding) {

    const elementTop = el.getBoundingClientRect().top;
    const elementHeight = el.offsetHeight;

    let f = function (evt: any) {
      const scrollTop = evt.target.scrollingElement.scrollTop

      if(elementTop < scrollTop){
        if(el.parentElement)
          el.parentElement.style.paddingBottom = `${elementHeight}px`;

        el.classList.add('scrolling-element')

      } else {
        if(el.parentElement)
          el.parentElement.style.paddingBottom = `0px`;

        el.classList.remove('scrolling-element')
      }
    }
    window.addEventListener('scroll', f)
  }
})

//partial import bulma, import global, import fonts
import "./sass/libraries/import_bulma.scss"
import './sass/fonts/fonts.scss'
import "./sass/global.scss"

import "../node_modules/tiny-slider/src/tiny-slider.scss"
import doc = Mocha.reporters.doc;

Vue.use(AuthGuard, { router, store });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
