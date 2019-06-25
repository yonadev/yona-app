import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import axios from "../../utils/axios/axios"
import router from "../../router"
import {toSeconds, parse} from 'iso8601-duration';
import { LoginState } from './types';
import { RootState } from '../types';

const state: LoginState = {
  isRegistered: false,
  isLocked: false,
  isLoggedIn: false,
  pinCode: 0,
  loginAttempts: 5,
  locked_timer: 0
};

const actions: ActionTree<LoginState, RootState> = {
  setPincode({commit}, data): any{
    commit('setPincode', data)
  },
  increaseLoginAttempts({commit, dispatch}): void{
    commit('increaseLoginAttempts')

    if(state.loginAttempts >= 5) {
      dispatch('setLocked')
    }
  },
  setProperty({commit}, data): void{
    commit('setProperty', data)
  },
  setLoggedIn({commit}): void {
    commit('resetLock');
    router.push({'name': 'Intro'});
  },
  async pinReset({commit, rootState, dispatch}) {

    if(rootState.links.links && rootState.links.links["yona:requestPinReset"]) {
      let response = await axios.post(rootState.links.links["yona:requestPinReset"].href, {}
      ).catch((error: any) => {
        console.log(error)
      });

      if(response) {
        let date = new Date();

        let seconds = Math.round(date.getTime()/1000)
        seconds += toSeconds(parse(response.data.delay))

        await dispatch('setLockedTimer', seconds);
      }
    }
  },
  setLocked({commit}): void {
    commit('setLocked');
    router.push({'name': 'Locked'});
  },
  setLockedTimer({commit}, seconds: number): void {
    commit('setLockedTimer', seconds)
    router.push({'name': 'WaitLocked'});
  },
  resetLock({commit}): void{
    commit('resetLock')
  }
};

const mutations: MutationTree<LoginState> = {
  setPincode(state, payload: LoginState) {
    state.pinCode = payload.pinCode;
  },
  increaseLoginAttempts(state) {
    state.loginAttempts++;
  },
  setProperty(state, payload: LoginState){
    Object.assign(state, payload)
  },
  setLocked(state) {
    state.isLocked = true;
  },
  setLockedTimer(state, seconds: number) {
      state.locked_timer = seconds;
  },
  resetLock(state){
    state.loginAttempts = 0;
    state.locked_timer = 0;
    state.isLocked = false;
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