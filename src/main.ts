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

Vue.directive('fixed-scroll', {
  inserted: function (el, binding) {
    let f = function (evt: any) {
      let elementPosition;

      if(!document.getElementById('placeholder-clone'))
        elementPosition = el;
      else
        elementPosition = document.getElementById('placeholder-clone');

      if(elementPosition && elementPosition.getBoundingClientRect().top <= 0){
        if(!document.getElementById('placeholder-clone')) {
          let clone = el.cloneNode(true);

          (clone as any).id = 'placeholder-clone';
          if(el.parentElement) {
            el.parentElement.append(clone);
            el.id = 'scrolling-element';
          }
        }
      } else if(document.getElementById('placeholder-clone')) {
        let element = document.getElementById('placeholder-clone');
        if(element && element.parentNode) {
          element.parentNode.removeChild(element);
          el.id = '';
        }
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
  render: h => h(App)
}).$mount('#app')
