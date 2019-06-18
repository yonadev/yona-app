import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { LinksState } from './types';
import { RootState } from '../types';

const state: LinksState = {
  links: {},
  embedded: {}
};

const actions: ActionTree<LinksState, RootState> = {
  setLinks({commit}, data): any{
    commit('setLinks', data)
  },
  setEmbedded({commit}, data): any{
    commit('setEmbedded', data)
  }
};

const mutations: MutationTree<LinksState> = {
  setLinks(state, payload: LinksState) {
    state.links = payload.links;
  },
  setEmbedded(state, payload: LinksState) {
    state.embedded = payload.embedded;
  }
};

const getters: GetterTree<LinksState, RootState> = {
  links(state) {
    return state.links;
  },
  embedded(state) {
    return state.embedded
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