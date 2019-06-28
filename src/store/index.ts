import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import Vuex, { StoreOptions, Plugin } from 'vuex';
import { RootState } from './types';
import { account, state as account_state } from './account/index';
import { api, state as api_state } from "./api/index";
import { login, state as login_state } from "./login/index";
import { challenges, state as challenges_state } from "./challenges/index";

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal : {plugin: Plugin<RootState>} = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex);

// initial state
const initialState: RootState = {
  api: {...api_state},
  account: {...account_state},
  login: {...login_state},
  challenges: {...challenges_state}
}

const store: StoreOptions<RootState> = {
  modules: {
    account: account,
    api: api,
    login: login,
    challenges: challenges
  },
  mutations: {
    resetAll(state) {
      Vue.set(state, 'api', initialState.api)
      Vue.set(state, 'account', initialState.account)
      Vue.set(state, 'login', initialState.login)
      Vue.set(state, 'challenges', initialState.challenges)
    }
  },
  plugins: [vuexLocal.plugin],
  strict: debug
};

export default new Vuex.Store<RootState>(store);