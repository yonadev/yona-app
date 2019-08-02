import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import axios from "../../utils/axios/axios";
import router from "../../router";
import { toSeconds, parse } from "iso8601-duration";
import { LoginState } from "./types";
import { RootState } from "../types";

export const state: LoginState = {
  isRegistered: false,
  isLocked: false,
  isLoggedIn: false,
  pinIsReset: false,
  pinIsSet: false,
  pinCode: null,
  loginAttempts: 0,
  locked_timer: 0,
  lastRoute: null
};

const actions: ActionTree<LoginState, RootState> = {
  setPincode({ commit }, data): any {
    commit("setPincode", data);
  },
  increaseLoginAttempts({ commit, dispatch, state }, data): void {
    commit("increaseLoginAttempts");

    if (state.loginAttempts >= 5) {
      dispatch("setLocked", data);
    }
  },
  setProperty({ commit }, data): void {
    commit("setProperty", data);
  },
  async setLoggedIn({ commit, rootState, dispatch, state }, data) {
    commit("resetLock");
    commit("setLoggedIn");
    dispatch("buddies/update", null, { root: true });
    dispatch("challenges/update", null, { root: true });

    if (!rootState.api.deviceUUID) {
      dispatch("api/setDeviceID", null, { root: true });
    }

    if (rootState.api.links && rootState.api.links["yona:postOpenAppEvent"]) {
      let OS = "ANDROID";
      //@ts-ignore
      if (typeof device !== "undefined") {
        //@ts-ignore
        OS = device.platform.toUpperCase();
      }

      let openApp: any = await axios
        .post(rootState.api.links["yona:postOpenAppEvent"].href, {
          operatingSystem: OS,
          appVersion: "1.1 build 83", //ToDo: get from Jenkins build
          appVersionCode: 31 //ToDo: get from Jenkins build
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (state.lastRoute !== null) {
      router.push(state.lastRoute);
    } else if (data.view !== "changePin") {
      router.push({ name: "MeTimeLineDay" });
    }
  },
  setLoggedOff({ commit, dispatch }): void {
    commit("setLoggedOff");
    dispatch("buddies/update", null, { root: true });
    dispatch("challenges/update", null, { root: true });
    router.push({ name: "Login" });
  },
  setLastRoute({ commit, state }): void {
    if (state.isLoggedIn)
      commit("setLastRoute", {
        name: router.currentRoute.name,
        params: router.currentRoute.params,
        query: router.currentRoute.query
      });
  },
  resetLastRoute({ commit }): void {
    commit("setLastRoute", null);
  },
  setRegistered({ commit }): void {
    commit("setRegistered");
  },
  async pinReset({ commit, rootState, dispatch }, data) {
    if (rootState.api.links && rootState.api.links["yona:requestPinReset"]) {
      const response = await axios.post(
        rootState.api.links["yona:requestPinReset"].href,
        {}
      );

      if (response) {
        const date = new Date();

        let seconds = Math.round(date.getTime() / 1000);
        seconds += toSeconds(parse(response.data.delay));

        await dispatch("setLockedTimer", { seconds, data });
      }
    }
  },
  setLocked({ commit }, data): void {
    commit("setLocked");

    if (data.view) {
      router.push({ name: "ChangeLocked" });
    } else {
      router.push({ name: "Locked" });
    }
  },
  setLockedTimer({ commit }, { seconds, data }): void {
    commit("setLocked");
    commit("setLockedTimer", seconds);
    if (data.view === "changePin") {
      router.push({ name: "ChangeWaitLocked" });
    } else {
      router.push({ name: "WaitLocked" });
    }
  },
  resetLock({ commit }): void {
    commit("resetLock");
  }
};

const mutations: MutationTree<LoginState> = {
  setPincode(state, payload: LoginState) {
    state.pinCode = payload.pinCode;
  },
  increaseLoginAttempts(state) {
    state.loginAttempts++;
  },
  setProperty(state, payload: LoginState) {
    Object.assign(state, payload);
  },
  setRegistered(state) {
    state.isRegistered = true;
    state.pinIsSet = true;
  },
  setLoggedIn(state) {
    state.isLoggedIn = true;
  },
  setLoggedOff(state) {
    state.isLoggedIn = false;
  },
  setLastRoute(state, payload) {
    state.lastRoute = payload;
  },
  setLocked(state) {
    state.isLocked = true;
    state.pinCode = null;
    state.pinIsSet = false;
  },
  setLockedTimer(state, seconds: number) {
    state.locked_timer = seconds;
    state.pinIsReset = true;
  },
  resetLock(state) {
    state.loginAttempts = 0;
    state.locked_timer = 0;
    state.isLocked = false;
    state.pinIsReset = false;
  }
};

const getters: GetterTree<LoginState, RootState> = {
  pinCode(state) {
    return state.pinCode;
  }
};

const namespaced: boolean = true;
export const login: Module<LoginState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
