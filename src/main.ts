import Vue from "vue";
import "@/utils/router/hooks";
import App from "./App.vue";
import router from "./router";
import AuthGuard from "./router/guard";
import "@/utils/validate/validate";
import i18n from "@/utils/i18n";
import { EventBus } from "@/utils/eventbus";

import moment from "moment";
moment.locale("nl");
moment.weekdays(false);

// @ts-ignore
import nl from "vee-validate/dist/locale/nl";
// @ts-ignore
import en from "vee-validate/dist/locale/en";
import dictionaryNl from "./locales/nl.json";
import dictionaryEn from "./locales/en.json";

const veeLocales: {
  [key: string]: {
    locale: {};
    dictionary: any;
  };
} = {
  nl: {
    locale: nl,
    dictionary: dictionaryNl
  },
  en: {
    locale: en,
    dictionary: dictionaryEn
  }
};

const dictionary = {
  // attributes and messages
  messages: {
    mobile: (fieldName: string, params: any[], data?: any) => {
      return veeLocales[i18n.locale].dictionary.numbervalidation;
    },
    required: (fieldName: string, params: any[], data?: any) => {
      let message;

      if (fieldName === "firstname") {
        message = veeLocales[i18n.locale].dictionary.enterfirstnamevalidation;
      } else if (fieldName === "lastname") {
        message = veeLocales[i18n.locale].dictionary.enterlastnamevalidation;
      } else if (fieldName === "nickname") {
        message = veeLocales[i18n.locale].dictionary.enternicknamevalidation;
      } else if (fieldName === "mobile") {
        message = veeLocales[i18n.locale].dictionary.entermobilevalidation;
      } else if (fieldName === "device_name") {
        message = veeLocales[i18n.locale].dictionary.enterdevicename;
      } else if (fieldName === "passcode") {
        message = veeLocales[i18n.locale].dictionary.enterpasscode;
      }

      return message;
    }
  }
};

Validator.localize(i18n.locale, veeLocales[i18n.locale].locale); // changes the locale
Validator.localize(i18n.locale, dictionary); // overwrites some messages

import store from "./store/index";

Vue.directive("fixed-scroll", {
  inserted(el, binding) {
    const elementTop = el.getBoundingClientRect().top;
    const elementHeight = el.offsetHeight;

    const f = (evt: any) => {
      const scrollTop = evt.target.scrollingElement.scrollTop;

      if (elementTop < scrollTop) {
        if (el.parentElement) {
          el.parentElement.style.paddingBottom = `${elementHeight}px`;
        }

        el.classList.add("scrolling-element");
      } else {
        if (el.parentElement) {
          el.parentElement.style.paddingBottom = `0px`;
        }

        el.classList.remove("scrolling-element");
      }
    };
    window.addEventListener("scroll", f);
  }
});

import VueObserveVisibility from "vue-observe-visibility";
Vue.use(VueObserveVisibility);

// partial import bulma, import global, import fonts
import "./sass/libraries/import_bulma.scss";
import "./sass/fonts/fonts.scss";
import "./sass/global.scss";

import "../node_modules/tiny-slider/src/tiny-slider.scss";
import { Validator } from "vee-validate";

Vue.use(AuthGuard, { router, store });

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  methods: {
    init() {
      const self = this;
      //@ts-ignore
      const crashlytics = FirebaseCrashlytics.initialise();

      //@ts-ignore
      const networkState = navigator.connection.type;
      //@ts-ignore
      if (networkState === Connection.NONE) {
        self.$store.dispatch("api/setOffline");
      } else {
        self.$store.dispatch("api/setOnline");
      }

      this.$store.dispatch("login/resetLastRoute");

      document.addEventListener("pause", () => this.pause(), false);
      document.addEventListener("resume", () => this.resume(), false);

      document.addEventListener(
        "offline",
        () => {
          self.$store.dispatch("api/setOffline");
          self.pause();
        },
        false
      );

      document.addEventListener(
        "online",
        () => {
          self.$store.dispatch("api/setOnline");
        },
        false
      );

      //@ts-ignore
      if (window.Intl && typeof window.Intl === "object") {
        const locale = navigator.language;
        self.$store.dispatch("api/setLocale", locale);
        if (locale.split("-")[0] === "nl") {
          this.$i18n.locale = "nl";
        } else {
          this.$i18n.locale = "en";
        }
      }

      //@ts-ignore
      if (window.navigator.splashscreen) {
        //@ts-ignore
        window.navigator.splashscreen.hide();
      }

      EventBus.$emit("device-ready");
    },
    pause() {
      this.$store.dispatch("login/setLastRoute");
      if (
        this.$store.state.login.lastRoute !== null &&
        this.$store.state.login.lastRoute.name !== "FriendsAddAddressBook"
      ) {
        this.$store.dispatch("login/setLoggedOff");
      }
    },
    resume() {
      EventBus.$emit("device-ready");
    }
  }
}).$mount("#app");

document.addEventListener("deviceready", app.init);
