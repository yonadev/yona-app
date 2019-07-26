import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { ApiState } from "./types";
import { RootState } from "../types";

export const state: ApiState = {
  host: "https://app.prd.yona.nu",
  yonaPassword: "",
  serverMessage: "",
  links: {},
  embedded: {}
};

const actions: ActionTree<ApiState, RootState> = {
  setHeaderPassword({ commit }, data): any {
    commit("setHeaderPassword", data);
  },
  setServerError({ commit, dispatch }, data): any {
    commit("setServerError", data);

    setTimeout(() => {
      dispatch("removeServerError");
    }, 5000)
  },
  removeServerError({ commit }): any {
    commit("setServerError", {serverMessage: ""});
  },
  setLinks({ commit }, data): any {
    commit("setLinks", data);
  },
  setEmbedded({ commit }, data): any {
    commit("setEmbedded", data);
  }
};

const mutations: MutationTree<ApiState> = {
  setHeaderPassword(state, payload: ApiState) {
    state.yonaPassword = payload.yonaPassword;
  },
  setServerError(state, payload: ApiState) {
    state.serverMessage = payload.serverMessage;
  },
  setLinks(state, payload: ApiState) {
    state.links = payload.links;
  },
  setEmbedded(state, payload: ApiState) {
    state.embedded = payload.embedded;
  }
};

const getters: GetterTree<ApiState, RootState> = {
  yonaPassword(state) {
    return state.yonaPassword;
  },
  links(state) {
    return state.links;
  },
  embedded(state) {
    return state.embedded;
  }
};

const namespaced: boolean = true;
export const api: Module<ApiState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
