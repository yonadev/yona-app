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
    store_files: {
      title: "Geef Yona toestemming om bestanden op te slaan",
      text:
        "Yona wil bestanden op je telefoon bewaren. " +
        "We zullen nooit bestanden van je telefoon bekijken of gegevens doorgeven aan derden.",
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
  async setUserData({ commit }, data) {
    console.log(data);
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
      ].find((device : any) => {
        return device.requestingDevice;
      });
    }

    if (
      // @ts-ignore
      typeof cordova.plugins !== "undefined" &&
      // @ts-ignore
      typeof cordova.plugins.SharedPreferences !== "undefined"
    ) {
      // @ts-ignore
      const sharedPreferences = cordova.plugins.SharedPreferences.getInstance();
      sharedPreferences.putString("YonaPassword", data.yonaPassword);

      if (currentDevice) {
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
    }
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
