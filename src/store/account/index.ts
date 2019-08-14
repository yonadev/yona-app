import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { AccountState } from "./types";
import { RootState } from "../types";
import axios from "../../utils/axios/axios";

export const state: AccountState = {
  firstname: "",
  lastname: "",
  phonenumber: "",
  nickname: "",
  permissions: {
    tracking: {
      title: "Maak app-tracking mogelijk",
      text:
        "Yona wil het gebruik van je apps graag kunnen meten. " +
        "Deze data is compleet veilig en zal nooit gedeeld worden met derden.",
      icon: "tracking_icon_small.svg",
      is_allowed: false
    },
    autostart: {
      title: "Geef Yona toestemming om automatisch op te starten",
      text:
        "Geef toestemming om de app automatisch te starten. " +
        "Dit zorgt ervoor dat de Yona app altijd automatisch actief is.",
      icon: "store_files_icon_small.svg",
      is_allowed: false
    },
    certificate: {
      title: "Accepteer Yona certificaat",
      text:
        "Voor een veilige verbinding is het nodig een certificaat te installeren. " +
        "Het certificaat zorgt ervoor dat je data nergens weg kan lekken.",
      icon: "certificate_icon_small.svg",
      is_allowed: false
    },
    vpn: {
      title: "Activeer VPN verbinding",
      text:
        "Bijna klaar. Nu het certificaat is geaccepteerd kan er een veilige VPN verbinding worden gemaakt. " +
        "Ook hier is jouw toestemming nodig.",
      icon: "vpn_profile_icon_small.svg",
      is_allowed: false
    }
  }
};

const actions: ActionTree<AccountState, RootState> = {
  setProperty({ commit }, data): void {
    commit("setProperty", data);
  },
  async setUserData({ commit, rootState, dispatch }, data) {
    commit("setUserData", {
      firstname: data.firstName,
      lastname: data.lastName,
      phonenumber: data.mobileNumber,
      nickname: data.nickname
    });

    let currentDevice = null;
    if (data._embedded["yona:devices"]) {
      currentDevice = data._embedded["yona:devices"]._embedded[
        "yona:devices"
      ].find((device: any) => {
        return device.requestingDevice;
      });
    }

    if (currentDevice) {
      if (currentDevice._links["yona:postOpenAppEvent"]) {
        let OS = "ANDROID";
        //@ts-ignore
        if (typeof device !== "undefined") {
          //@ts-ignore
          OS = device.platform.toUpperCase();
        }

        let openApp: any = await axios
          .post(currentDevice._links["yona:postOpenAppEvent"].href, {
            operatingSystem: OS,
            appVersion: "1.1 build 83", //ToDo: get from Jenkins build
            appVersionCode: 31 //ToDo: get from Jenkins build
          })
          .catch(error => {
            dispatch("resetAll", null, { root: true });
          });
      }

      if (
        // @ts-ignore
        typeof cordova !== "undefined" &&
        // @ts-ignore
        typeof cordova.plugins !== "undefined" &&
        // @ts-ignore
        typeof cordova.plugins.UserPreferences !== "undefined"
      ) {
        // @ts-ignore
        const sharedPreferences = cordova.plugins.UserPreferences.getInstance();
        sharedPreferences.putString("YonaPassword", data.yonaPassword);
        sharedPreferences.putString("BaseUrl", rootState.api.host);
        if (typeof currentDevice._links["yona:appActivity"] !== "undefined") {
          sharedPreferences.putString(
            "appActivityLink",
            currentDevice._links["yona:appActivity"].href
          );
        }
        if (typeof currentDevice.vpnProfile !== "undefined") {
          sharedPreferences.putString(
            "vpnLoginID",
            currentDevice.vpnProfile.vpnLoginID
          );
          sharedPreferences.putString(
            "vpnPassword",
            currentDevice.vpnProfile.vpnLoginID
          );

          const vpnProfile = await axios.get(
            currentDevice.vpnProfile._links["yona:ovpnProfile"].href
          );

          sharedPreferences.putString("ovpnProfile", vpnProfile.data);
        }
      }

      return true;
    } else {
      dispatch("resetAll", null, { root: true });
    }
    return false;
  },
  setPermission({ commit }, data): void {
    commit("setPermission", data);
  }
};

const mutations: MutationTree<AccountState> = {
  setProperty(state, payload: AccountState) {
    Object.assign(state, payload);
  },
  setUserData(state, payload: AccountState) {
    Object.assign(state, payload);
  },
  setPermission(state, { key, value }) {
    (state.permissions as any)[key].is_allowed = value;
  }
};

const getters: GetterTree<AccountState, RootState> = {};

const namespaced: boolean = true;
export const account: Module<AccountState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
