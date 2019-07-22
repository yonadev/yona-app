import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { BuddiesState } from './types';
import { RootState } from '../types';

import axios from '@/utils/axios/axios';

export const state: BuddiesState = {
  loaded: false,
  buddies: [],
};

const actions: ActionTree<BuddiesState, RootState> = {
  async update({state, dispatch}) {
    if (!state.loaded) {
      await dispatch('getBuddies');
    }
  },
  async getBuddies({commit, dispatch, rootState}) {
    if (rootState.api.embedded != null) {
      const response = await axios.get(rootState.api.embedded['yona:buddies']._links.self.href);
      if (response.status === 200) {
        commit('setBuddies', response);
        await dispatch('getBuddyImages');
        return true;
      }
    }
  },
  async getBuddyImages({commit, state}) {
    Promise.all(
      state.buddies.map(async (buddy, index) => {

        let hasPhoto = false;

        if (buddy._embedded['yona:user']._links['yona:userPhoto']) {
          const userPhotoResponse: any = await axios.get(buddy._embedded['yona:user']._links['yona:userPhoto'].href, {
            responseType: 'arraybuffer',
          });

          if (userPhotoResponse) {
            // @ts-ignore
            const userPhoto = new Buffer.from(userPhotoResponse.data, 'binary').toString('base64');
            window.localStorage.setItem(
                buddy._embedded['yona:user']._links.self.href,
                JSON.stringify({type: 'buddy', src: 'data:image/png;base64,' + userPhoto}),
            );
            hasPhoto = true;
          }
        }

        if (!hasPhoto) {
          window.localStorage.setItem(
              buddy._embedded['yona:user']._links.self.href,
              JSON.stringify({
                type: 'buddy',
                text: buddy._embedded['yona:user'].firstName.charAt(0) +
                    buddy._embedded['yona:user'].lastName.charAt(0),
              }),
          );
        }

      }),
    );
  },
};

const mutations: MutationTree<BuddiesState> = {
  setBuddies(state: BuddiesState, {data}) {
    state.buddies = data._embedded['yona:buddies'];
    state.loaded = true;
  },
};

const getters: GetterTree<BuddiesState, RootState> = {
  buddy(state: BuddiesState) {
    return (href: string) => state.buddies.find((buddy) => {
      return buddy._links.self.href === href;
    });
  },
  goal(state: BuddiesState) {
    return (buddyHref: string, href: string) => {
      const buddy = state.buddies.find((buddy) => {
        return buddy._links.self.href === buddyHref;
      });

      if (buddy) {
         return buddy._embedded['yona:goals']._embedded['yona:goals'].find((buddyGoal) =>
             buddyGoal._links.self.href === href);
      }
    };
  },
};

const namespaced: boolean = true;
export const buddies: Module<BuddiesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
