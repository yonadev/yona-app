import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { LoginState } from './types';
import { RootState } from '../types';

const state: LoginState = {
  pinCode: 0
};

const actions: ActionTree<LoginState, RootState> = {
  setPincode({commit}, data): any{
    commit('setPincode', data)
  }
};

const mutations: MutationTree<LoginState> = {
  setPincode(state, payload: LoginState) {
    state.pinCode = payload.pinCode;
  }
};

const getters: GetterTree<LoginState, RootState> = {
  pinCode(state) {
    return state.pinCode;
  }
};

const namespaced: boolean = true;
export const login: Module<LoginState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};