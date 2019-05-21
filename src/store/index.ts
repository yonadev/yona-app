import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { account } from './account/index';
import { header } from "./header/index";
import { links } from "./links/index";

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {},
  modules: {
    account: account,
    header: header,
    links: links
  },
  plugins: [vuexLocal.plugin],
  strict: debug
};

export default new Vuex.Store<RootState>(store);