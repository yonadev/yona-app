import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { login } from './login/index';

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {},
  modules: {
    login: login
  },
  strict: debug
};

export default new Vuex.Store<RootState>(store);