import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { ChallengesState } from './types';
import { RootState } from '../types';

export const state: ChallengesState = {
  setupType: '',
  setupCategory: ''
};

const actions: ActionTree<ChallengesState, RootState> = {
  setSetupType({commit}, data): any{
    commit('setSetupType', {
      setupType: data.setupType
    })
  },
  setCategory({commit}, data): any{
    commit('setCategory', data.category)
  }
};

const mutations: MutationTree<ChallengesState> = {
  setSetupType(state, payload: ChallengesState){
    Object.assign(state, payload)
  },
  setCategory(state, payload){
      state.setupCategory = payload
  }
};

const getters: GetterTree<ChallengesState, RootState> = {};

const namespaced: boolean = true;
export const challenges: Module<ChallengesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};