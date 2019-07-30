import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { ApiState } from "./types";
import { RootState } from "../types";
import i18n from "@/utils/i18n";

export const state: ApiState = {
  host: "https://app.prd.yona.nu",
  locale: 'en-US',
  yonaPassword: "",
  serverMessage: "",
  online: false,
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
    }, 5000);
  },
  removeServerError({ commit }): any {
    commit("setServerError", { serverMessage: "" });
  },
  setOffline({ commit, dispatch }): any {
    commit("setOnlineStatus", false);
    dispatch("setServerError", {
      serverMessage: i18n.t("connectionnotavailable")
    });
  },
  setLocale({ commit }, locale): void {
    commit("setLocale", locale)
  },
  setOnline({ commit }): any {
    commit("setOnlineStatus", true);
  },
  setLinks({ commit }, data): any {
    commit("setLinks", data);
  },
  setEmbedded({ commit }, data): any {
    commit("setEmbedded", data);
  },
  setHost({ commit }, data): any {
    commit("setHost", data);
  }
};

const mutations: MutationTree<ApiState> = {
  setLocale(state, locale) {
    state.locale = locale;
  },
  setHeaderPassword(state, payload: ApiState) {
    state.yonaPassword = payload.yonaPassword;
  },
  setServerError(state, payload: ApiState) {
    state.serverMessage = payload.serverMessage;
  },
  setOnlineStatus(state, bool) {
    state.online = bool;
  },
  setLinks(state, payload: ApiState) {
    state.links = payload.links;
  },
  setEmbedded(state, payload: ApiState) {
    state.embedded = payload.embedded;
  },
  setHost(state, payload: ApiState) {
    state.host = payload.host;
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
