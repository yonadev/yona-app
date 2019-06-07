import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { AccountState } from './types';
import { RootState } from '../types';

const state: AccountState = {
  firstname: '',
  lastname: '',
  phonenumber: '',
  nickname: ''
};

const actions: ActionTree<AccountState, RootState> = {
  setProperty({commit}, data): any{
    commit('setProperty', data)
  }
};

const mutations: MutationTree<AccountState> = {
  setProperty(state, payload: AccountState){
    Object.assign(state, payload)
  }
};

const getters: GetterTree<AccountState, RootState> = {};

const namespaced: boolean = true;
export const account: Module<AccountState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};