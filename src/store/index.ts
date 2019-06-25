import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import Vuex, { StoreOptions, Plugin } from 'vuex';
import { RootState } from './types';
import { account } from './account/index';
import { header } from "./header/index";
import { links } from "./links/index";
import { login } from "./login/index";
import { challenges } from "./challenges/index";

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal : {plugin: Plugin<RootState>} = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {},
  modules: {
    account: account,
    header: header,
    links: links,
    login: login,
    challenges: challenges
  },
  plugins: [vuexLocal.plugin],
  strict: debug
};

export default new Vuex.Store<RootState>(store);