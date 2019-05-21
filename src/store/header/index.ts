import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { HeaderState } from './types';
import { RootState } from '../types';

const state: HeaderState = {
  yonaPassword: ''
};

const actions: ActionTree<HeaderState, RootState> = {
  setHeaderPassword({commit}, data): any{
    console.log(data)
    commit('setHeaderPassword', data)
  }
};

const mutations: MutationTree<HeaderState> = {
  setHeaderPassword(state, payload: HeaderState) {
    state.yonaPassword = payload.yonaPassword;
  }
};

const getters: GetterTree<HeaderState, RootState> = {
  yonaPassword(state) {
    return state.yonaPassword;
  }
};

const namespaced: boolean = true;
export const header: Module<HeaderState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};