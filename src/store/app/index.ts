import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { AppState } from "./types";
import { RootState } from "../types";
import i18n from "@/utils/i18n";
import Vue from "vue/types/vue";

export const state: AppState = {
  versionNumber: "1.0.8",
  versionCode: 10008
};

const actions: ActionTree<AppState, RootState> = {
  async setAppVersion({ commit }) {
    if (
      //@ts-ignore
      typeof cordova !== "undefined" &&
      //@ts-ignore
      typeof cordova.plugins !== "undefined" &&
      //@ts-ignore
      typeof cordova.plugins.AppVersion !== "undefined"
    ) {
      //@ts-ignore
      const versionNumber = await cordova.plugins.AppVersion.getVersionNumber();
      commit("setVersionNumber", versionNumber);
      //@ts-ignore
      const versionCode = await cordova.plugins.AppVersion.getVersionCode();
      commit("setVersionCode", versionCode);
    }
  }
};

const mutations: MutationTree<AppState> = {
  setVersionNumber(state, number) {
    state.versionNumber = number;
  },
  setVersionCode(state, code) {
    state.versionCode = code;
  }
};

const getters: GetterTree<AppState, RootState> = {
  versionNumber(state) {
    return state.versionNumber;
  },
  versionCode(state) {
    return state.versionCode;
  }
};

const namespaced: boolean = true;
export const app: Module<AppState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
