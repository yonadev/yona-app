import Vue from "vue";
import VuexPersistence from "vuex-persist";
import Vuex, { StoreOptions, Plugin } from "vuex";
import { RootState } from "./types";
import { account, state as account_state } from "./account/index";
import { api, state as api_state } from "./api/index";
import { login, state as login_state } from "./login/index";
import { challenges, state as challenges_state } from "./challenges/index";
import { buddies, state as buddies_state } from "./buddies/index";

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
      isLoggedIn: false
    },
    account: state.account
  })
});

Vue.use(Vuex);

// initial state
const initialState: RootState = {
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
  mutations: {
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
