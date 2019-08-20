import Vue from "vue";
import VuexPersistence from "vuex-persist";
import Vuex, { StoreOptions, Plugin } from "vuex";
import { RootState } from "./types";
import { account, state as account_state } from "./account/index";
import { api, state as api_state } from "./api/index";
import { login, state as login_state } from "./login/index";
import { challenges, state as challenges_state } from "./challenges/index";
import { buddies, state as buddies_state } from "./buddies/index";
import router from "../router";

const debug = process.env.NODE_ENV !== "production";

const vuexLocal: { plugin: Plugin<RootState> } = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    api: {
      ...state.api,
      serverMessage: ""
    },
    login: {
      ...state.login,
      isLoggedIn: false,
      online: true
    },
    account: state.account
  })
});

Vue.use(Vuex);

// initial state
const initialState: RootState = {
  versionNumber: "1.0",
  versionCode: 1,
  api: { ...api_state },
  account: { ...account_state },
  login: { ...login_state },
  challenges: { ...challenges_state },
  buddies: { ...buddies_state }
};

const store: StoreOptions<RootState> = {
  modules: {
    account,
    api,
    login,
    challenges,
    buddies
  },
  actions: {
    async setAppVersion({ commit }) {
      if (
        //@ts-ignore
        typeof cordova !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins.AppVersion !== "undefined"
      ) {
        //@ts-ignore
        const versionNumber = await cordova.plugins.AppVersion.getVersionNumber();
        commit("setVersionNumber", versionNumber);
        //@ts-ignore
        const versionCode = await cordova.plugins.AppVersion.getVersionCode();
        commit("setVersionCode", versionCode);
      }
    },
    async resetAll({ commit }) {
      commit("resetAll");
      if (
        //@ts-ignore
        typeof cordova !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins !== "undefined" &&
        //@ts-ignore
        cordova.plugins.firebase
      ) {
        //@ts-ignore
        await cordova.plugins.firebase.messaging.revokeToken();
      }

      if (
        //@ts-ignore
        typeof cordova !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins.SharedPreferences !== "undefined"
      ) {
        // @ts-ignore
        const sharedPreferences = cordova.plugins.SharedPreferences.getInstance();
        sharedPreferences.clear();
      }
      if (
        //@ts-ignore
        typeof cordova !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins.YonaServices !== "undefined"
      ) {
        //@ts-ignore
        cordova.plugins.YonaServices.disable();
      }

      router.push({ name: "Tour" });
    }
  },
  mutations: {
    setVersionNumber(state, number) {
      Vue.set(state, "versionNumber", number);
    },
    setVersionCode(state, code) {
      Vue.set(state, "versionCode", code);
    },
    resetAll(state) {
      Vue.set(state, "api", initialState.api);
      Vue.set(state, "account", initialState.account);
      Vue.set(state, "login", initialState.login);
      Vue.set(state, "challenges", initialState.challenges);
      Vue.set(state, "buddies", initialState.buddies);
    }
  },
  plugins: [vuexLocal.plugin],
  strict: debug
};

export default new Vuex.Store<RootState>(store);
