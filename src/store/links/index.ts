import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { LinksState } from './types';
import { RootState } from '../types';

const state: LinksState = {
  links: {}
};

const actions: ActionTree<LinksState, RootState> = {
  setLinks({commit}, data): any{
    commit('setLinks', data)
  }
};

const mutations: MutationTree<LinksState> = {
  setLinks(state, payload: LinksState) {
    state.links = payload.links;
  }
};

const getters: GetterTree<LinksState, RootState> = {
  links(state) {
    return state.links;
  }
};

const namespaced: boolean = true;
export const links: Module<LinksState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};