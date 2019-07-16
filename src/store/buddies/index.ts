import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { BuddiesState } from './types';
import { RootState } from '../types';

import axios from "@/utils/axios/axios";

export const state: BuddiesState = {
  loaded: false,
  buddies: []
};

const actions: ActionTree<BuddiesState, RootState> = {
  async update ({state, dispatch}) {
    if(!state.loaded) {
      await dispatch('getBuddies');
    }
  },
  async getBuddies ({commit, rootState}) {
    if(rootState.api.embedded != null) {
      const response = await axios.get(rootState.api.embedded['yona:buddies']._links.self.href);
      if (response.status == 200) {
        commit('setBuddies', response);
        return true;
      }
    }
  }
};

const mutations: MutationTree<BuddiesState> = {
  setBuddies(state, {data}) {
    console.log(data)

    state.buddies = data._embedded['yona:buddies'];
  }
};

const getters: GetterTree<BuddiesState, RootState> = {
  buddy(state) {
    return (href: string) => state.buddies.find(buddy => {
      return buddy._links.self.href === href;
    })
  },
  goal(state) {
    return (buddy_href:string, href: string) => {
      const buddy = state.buddies.find(buddy => {
        return buddy._links.self.href === buddy_href;
      })

      if(buddy)
        return buddy._embedded['yona:goals']._embedded['yona:goals'].find(buddy_goal => buddy_goal._links.self.href === href)
    }
  }
};

const namespaced: boolean = true;
export const buddies: Module<BuddiesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};