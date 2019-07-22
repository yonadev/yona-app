import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { AccountState } from './types';
import { RootState } from '../types';

export const state: AccountState = {
  firstname: '',
  lastname: '',
  phonenumber: '',
  nickname: '',
  permissions: {
    tracking: {
      title: 'Maak app-tracking mogelijk',
      text: 'Yona wil het gebruik van je apps graag kunnen meten. Deze data is compleet veilig en zal nooit gedeeld worden met derden.',
      icon: 'tracking_icon_small.svg',
      is_allowed: false,
    },
    store_files: {
      title: 'Geef Yona toestemming om bestanden op te slaan',
      text: 'Yona wil bestanden op je telefoon bewaren. We zullen nooit bestanden van je telefoon bekijken of gegevens doorgeven aan derden.',
      icon: 'store_files_icon_small.svg',
      is_allowed: false,
    },
    certificate: {
      title: 'Accepteer Yona certificaat',
      text: 'Voor een veilige verbinding is het nodig een certificaat te installeren. Het certificaat zorgt ervoor dat je data nergens weg kan lekken.',
      icon: 'certificate_icon_small.svg',
      is_allowed: false,
    },
    vpn: {
      title: 'Activeer VPN verbinding',
      text: 'Bijna klaar. Nu het certificaat is geaccepteerd kan er een veilige VPN verbinding worden gemaakt. Ook hier is jouw toestemming nodig.',
      icon: 'vpn_profile_icon_small.svg',
      is_allowed: false,
    },
  },
};

const actions: ActionTree<AccountState, RootState> = {
  setProperty({commit}, data): void {
    commit('setProperty', data);
  },
  setUserData({commit}, data): void {
    commit('setUserData', {
      firstname: data.firstName,
      lastname: data.lastName,
      phonenumber: data.mobileNumber,
      nickname: data.nickname,
    });
  },
  setPermission({commit}, data): void {
    commit('setPermission', data);
  },
};

const mutations: MutationTree<AccountState> = {
  setProperty(state, payload: AccountState) {
    Object.assign(state, payload);
  },
  setUserData(state, payload: AccountState) {
    Object.assign(state, payload);
  },
  setPermission(state, {key, value}) {
    (state.permissions as any)[key].is_allowed = value;
  },
};

const getters: GetterTree<AccountState, RootState> = {};

const namespaced: boolean = true;
export const account: Module<AccountState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
