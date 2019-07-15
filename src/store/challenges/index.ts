import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { ChallengesState } from './types';
import { RootState } from '../types';

import axios from "@/utils/axios/axios";

export const state: ChallengesState = {
  loaded: false,
  activityCategories: [],
  goals: [],
};

const actions: ActionTree<ChallengesState, RootState> = {
  async update ({state, dispatch}) {
    if(!state.loaded) {
      await dispatch('getActivityCategories');
      await dispatch('getGoals');
    }
  },
  async getActivityCategories ({commit, rootState}) {
    const response = await axios.get(rootState.api.host + '/activityCategories/')
    commit('setActivityCategories', response)
  },
  async getGoals ({commit, rootState}) {
    if(rootState.api.embedded != null) {
      const response = await axios.get(rootState.api.embedded['yona:goals']._links.self.href);
      commit('setGoals', response)
    }
  },
  async saveGoal ({commit, rootState, dispatch}, data) {
    if(rootState.api.embedded != null) {
      const response = await axios.post(rootState.api.embedded['yona:goals']._links.self.href, data);
      if(response.status == 200) {
        dispatch('getGoals');
        return true;
      }
    }
  },
  async updateGoal ({commit, rootState, dispatch}, {url, data}) {
    if(rootState.api.embedded != null) {
      const response = await axios.put(url, data);
      if(response.status == 200) {
        dispatch('getGoals');
        return true;
      }
    }
  },
  async deleteGoal ({commit, rootState, dispatch}, goal_url) {
    if(rootState.api.embedded != null) {
      const response = await axios.delete(goal_url);
      if(response.status == 200) {
        dispatch('getGoals');
        return true;
      }
    }
  }
};

const mutations: MutationTree<ChallengesState> = {
  setActivityCategories(state, {data}) {
    state.activityCategories = data._embedded['yona:activityCategories'];
  },
  setGoals(state, {data}) {
    state.goals = data._embedded['yona:goals'];
  }
};

const getters: GetterTree<ChallengesState, RootState> = {
    activityCategory(state) {
      return (href: string) => state.activityCategories.find(activityCategory => {
        return activityCategory._links.self.href === href;
      })
    },
    goal(state) {
      return (href: string) => state.goals.find(goal => {
        return goal._links.self.href === href;
      })
    },
    goalsByType(state) {
      return (type: string, historyItem: boolean = false) => state.goals.filter(goal => {
        switch(type) {
          case "NoGoGoal":
            return goal['@type'] === 'BudgetGoal' && typeof goal.maxDurationMinutes !== "undefined" && goal.maxDurationMinutes === 0 && (!goal.historyItem || historyItem);
          case "BudgetGoal":
            return goal['@type'] === 'BudgetGoal' && typeof goal.maxDurationMinutes !== "undefined" && goal.maxDurationMinutes > 0 && (!goal.historyItem || historyItem);
          case "TimeZoneGoal":
            return goal['@type'] === 'TimeZoneGoal' && (!goal.historyItem || historyItem);
        }
      })
    },
    unusedCategories(state) {
      return state.activityCategories.filter(activityCategory => {
        return state.goals.filter(goal => {
            return goal._links["yona:activityCategory"].href == activityCategory._links.self.href
        }).length == 0
      });
    }
};

const namespaced: boolean = true;
export const challenges: Module<ChallengesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};