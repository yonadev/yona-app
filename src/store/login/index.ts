import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { LoginState } from './types';
import { RootState } from '../types';

const state: LoginState = {
  pinCode: 0,
  loginAttempts: 5,
  locked_timer: 0
};

const actions: ActionTree<LoginState, RootState> = {
  setPincode({commit}, data): any{
    commit('setPincode', data)
  },
  setProperty({commit}, data): any{
    commit('setProperty', data)
  },
  resetLock({commit}): any{
    commit('resetLock')
  }
};

const mutations: MutationTree<LoginState> = {
  setPincode(state, payload: LoginState) {
    state.pinCode = payload.pinCode;
  },
  setProperty(state, payload: LoginState){
    Object.assign(state, payload)
  },
  resetLock(state){
    state.loginAttempts = 5
    state.locked_timer = 0
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