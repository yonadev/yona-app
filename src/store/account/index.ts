import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { AccountState } from './types';
import { RootState } from '../types';

const state: AccountState = {
  firstname: '',
  lastname: '',
  phonenumber: '',
  nickname: '',
  pinCode: 0
};

const actions: ActionTree<AccountState, RootState> = {
  setPincode({commit}, data): any{
    commit('setPincode', data)
  },
  setProperty({commit}, data): any{
    commit('setProperty', data)
  }
};

const mutations: MutationTree<AccountState> = {
  setPincode(state, payload: AccountState) {
    state.pinCode = payload.pinCode;
  },
  setProperty(state, payload: AccountState){
    Object.assign(state, payload)
  }
};

const getters: GetterTree<AccountState, RootState> = {
  pinCode(state) {
    return state.pinCode;
  }
};

const namespaced: boolean = true;
export const account: Module<AccountState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};