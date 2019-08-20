import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { AccountState } from "./types";
import { RootState } from "../types";
import axios from "../../utils/axios/axios";
import i18n from "../../utils/i18n";
import Vue from "vue";
import store from "@/store";

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
      is_allowed: false,
      disabled: false
    },
    autostart: {
      title: "Geef Yona toestemming om automatisch op te starten",
      text:
        "Geef toestemming om de app automatisch te starten. " +
        "Dit zorgt ervoor dat de Yona app altijd automatisch actief is.",
      icon: "store_files_icon_small.svg",
      is_allowed: false,
      disabled: false
    },
    certificate: {
      title: "Accepteer Yona certificaat",
      text:
        "Voor een veilige verbinding is het nodig een certificaat te installeren. " +
        "Het certificaat zorgt ervoor dat je data nergens weg kan lekken.",
      icon: "certificate_icon_small.svg",
      is_allowed: false,
      disabled: true
    },
    vpn: {
      title: "Activeer VPN verbinding",
      text:
        "Bijna klaar. Nu het certificaat is geaccepteerd kan er een veilige VPN verbinding worden gemaakt. " +
        "Ook hier is jouw toestemming nodig.",
      icon: "vpn_profile_icon_small.svg",
      is_allowed: false,
      disabled: true
    }
  }
};

const actions: ActionTree<AccountState, RootState> = {
  setProperty({ commit, dispatch }, data): void {
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
            appVersion: rootState.app.versionNumber,
            appVersionCode: rootState.app.versionCode
          })
          .catch(error => {
            dispatch("resetAll", null, { root: true });
            dispatch(
              "api/setServerError",
              {
                serverMessage: i18n.t("error_device_not_Found")
              },
              { root: true }
            );
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
      dispatch(
        "api/setServerError",
        {
          serverMessage: i18n.t("error_device_not_Found")
        },
        { root: true }
      );
    }
    return false;
  },
  async setDefaultPermissions({ commit }) {
    if (
      //@ts-ignore
      typeof cordova !== "undefined" &&
      //@ts-ignore
      typeof cordova.plugins.YonaServices !== "undefined"
    ) {
      //@ts-ignore
      cordova.plugins.YonaServices.checkUsageAccess().then(function(
        hasUsageAccess: boolean
      ) {
        commit("setPermission", {
          key: "tracking",
          value: hasUsageAccess
        });
      });
      //@ts-ignore
      cordova.plugins.YonaServices.checkAppStartSettings().then(function(
        isAvailable: boolean
      ) {
        commit("setAutoStart", !isAvailable);
      });
    }
  },
  setPermission({ commit }, data): void {
    commit("setPermission", data);
  },
  setAutoStart({ commit }, data): void {
    commit("setAutoStart", data);
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
    switch (key) {
      case "tracking":
        Vue.set(state.permissions.tracking, "is_allowed", value);
        break;
      case "autostart":
        Vue.set(state.permissions.autostart, "is_allowed", value);
        break;
      case "certificate":
        Vue.set(state.permissions.certificate, "is_allowed", value);
        break;
      case "vpn":
        Vue.set(state.permissions.vpn, "is_allowed", value);
        break;
    }
  },
  setAutoStart(state, value) {
    Vue.set(state.permissions.autostart, "disabled", value);
  }
};

const getters: GetterTree<AccountState, RootState> = {
  hasAllPermissions(state) {
    if (
      (state.permissions.tracking.is_allowed ||
        state.permissions.tracking.disabled) &&
      (state.permissions.autostart.is_allowed ||
        state.permissions.autostart.disabled) &&
      (state.permissions.certificate.is_allowed ||
        state.permissions.certificate.disabled) &&
      (state.permissions.vpn.is_allowed || state.permissions.vpn.disabled)
    ) {
      return true;
    }
    return false;
  }
};

const namespaced: boolean = true;
export const account: Module<AccountState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
