import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import Vuex, { StoreOptions, Plugin } from 'vuex';
import { RootState } from './types';
import { account } from './account/index';
import { api } from "./api/index";
import { login } from "./login/index";
import { challenges } from "./challenges/index";

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal : {plugin: Plugin<RootState>} = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    account: account,
    api: api,
    login: login,
    challenges: challenges
  },
  plugins: [vuexLocal.plugin],
  strict: debug
};

export default new Vuex.Store<RootState>(store);