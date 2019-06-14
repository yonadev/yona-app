import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { AccountState } from './types';
import { RootState } from '../types';

const state: AccountState = {
  firstname: '',
  lastname: '',
  phonenumber: '',
  nickname: '',
  userphoto: '',
};

const actions: ActionTree<AccountState, RootState> = {
  setProperty({commit}, data): any{
    commit('setProperty', data)
  },
  setUserData({commit}, data): any{
    commit('setUserData', {
      firstname: data.firstName,
      lastname: data.lastName,
      phonenumber: data.mobileNumber,
      nickname: data.nickname
    })
  }
};

const mutations: MutationTree<AccountState> = {
  setProperty(state, payload: AccountState){
    Object.assign(state, payload)
  },
  setUserData(state, payload: AccountState){
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