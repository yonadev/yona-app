import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { AccountState } from "./types";
import { RootState } from "../types";
import axios from "../../utils/axios/axios";
import i18n from "../../utils/i18n";
import Vue from "vue";

export const state: AccountState = {
  firstname: "",
  lastname: "",
  phonenumber: "",
  nickname: "",
  currentDevice: null,
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
    store_files: {
      title: "Geef Yona toestemming om bestanden op te slaan",
      text:
        "Yona wil bestanden op je telefoon bewaren. We zullen nooit bestanden van je telefoon bekijken of gegevens doorgeven aan derden.",
      icon: "certificate_icon_small.svg",
      is_allowed: false,
      disabled: false
    },
    vpn: {
      title: "Activeer VPN verbinding",
      text:
        "Bijna klaar. Nu het certificaat is geaccepteerd kan er een veilige VPN verbinding worden gemaakt. " +
        "Ook hier is jouw toestemming nodig.",
      icon: "vpn_profile_icon_small.svg",
      is_allowed: false,
      disabled: false
    }
  }
};

const actions: ActionTree<AccountState, RootState> = {
  setProperty({ commit, dispatch, state }, data): void {
    commit("setProperty", data);
  },
  async migrateAppData({ commit, rootState, dispatch }) {
    if (rootState.login.isRegistered) {
      return true;
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
      const userPreferences = cordova.plugins.UserPreferences;
      const migrationData = await userPreferences.getMigrationData;

      dispatch(
        "login/setPincode",
        {
          pinCode: migrationData.passCode
        },
        { root: true }
      );
      dispatch(
        "api/setLinks",
        {
          links: {
            self: {
              href: migrationData.selfHref
            }
          }
        },
        { root: true }
      );
      dispatch(
        "api/setHeaderPassword",
        {
          yonaPassword: migrationData.passWord
        },
        { root: true }
      );
      dispatch("login/setSoftRegistered", null, { root: true });
      await dispatch("setUserData");
    }
  },
  async setUserData({ commit, rootState, dispatch }) {
    if (rootState.api.links) {
      let user_response: any = await axios.get(
        rootState.api.links["self"].href
      );

      let data;
      if (user_response) {
        data = user_response.data;
      } else {
        return false;
      }

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
        commit("setCurrentDevice", currentDevice);

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
          const userPreferences = cordova.plugins.UserPreferences;
          userPreferences.setYonaPassword(data.yonaPassword);
          userPreferences.setServerUrl(rootState.api.host);
          if (typeof currentDevice._links["yona:appActivity"] !== "undefined") {
            userPreferences.setAppActivityUrl(
              currentDevice._links["yona:appActivity"].href
            );
          }
        }

        if (rootState.api.links["yona:userPhoto"]) {
          let photo_response: any = await axios.get(
            rootState.api.links["yona:userPhoto"].href,
            {
              responseType: "arraybuffer"
            }
          );

          if (photo_response) {
            //@ts-ignore
            const userPhoto = new Buffer.from(
              photo_response.data,
              "binary"
            ).toString("base64");
            window.localStorage.setItem(
              "user_image",
              JSON.stringify({
                type: "me",
                src: "data:image/png;base64," + userPhoto
              })
            );
          }
        } else {
          const user_image = window.localStorage.getItem("user_image");

          if (!user_image) {
            window.localStorage.setItem(
              "user_image",
              JSON.stringify({
                type: "me",
                text:
                  user_response.data.firstName.charAt(0) +
                  user_response.data.lastName.charAt(0)
              })
            );
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
        hasUsageAccess: string
      ) {
        commit("setPermission", {
          key: "tracking",
          value: hasUsageAccess === "true"
        });
      });
      //@ts-ignore
      cordova.plugins.YonaServices.checkAppStartSettings().then(function(
        isAvailable: string
      ) {
        commit("setAutoStart", isAvailable !== "true");
      });
      //@ts-ignore
      const Permission = window.plugins.Permission;
      const permission = "android.permission.WRITE_EXTERNAL_STORAGE";

      let hasPermission = await new Promise((resolve, reject) => {
        Permission.has(
          permission,
          function(results: any) {
            if (!results[permission]) {
              resolve(false);
            } else {
              resolve(true);
            }
          },
          (err: string) => reject(err)
        );
      });

      commit("setPermission", {
        key: "store_files",
        value: hasPermission === true
      });
    }
  },
  setPermission({ commit }, data): void {
    commit("setPermission", data);
  },
  setAutoStart({ commit }, data): void {
    commit("setAutoStart", data);
  },
  async updateCurrentDevice({ commit, state, rootState }, firebaseInstanceId) {
    if (state.currentDevice) {
      let response: any = await axios
        .put(state.currentDevice._links.edit.href, {
          name: state.currentDevice.name,
          firebaseInstanceId
        })
        .catch(function(error: any) {
          console.log(error);
        });

      //This will get the devices and set it through axios interceptor
      if (rootState.api.links) {
        await axios
          .get(rootState.api.links["self"].href)
          .catch((error: any) => {
            console.log(error);
          });
      }

      if (response) {
        commit("setCurrentDevice", response.data);
      }
    }
  }
};

const mutations: MutationTree<AccountState> = {
  setProperty(state, payload: AccountState) {
    Object.assign(state, payload);
  },
  setUserData(state, payload: AccountState) {
    Object.assign(state, payload);
  },
  setCurrentDevice(state, payload) {
    Vue.set(state, "currentDevice", payload);
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
      case "store_files":
        Vue.set(state.permissions.store_files, "is_allowed", value);
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
      (state.permissions.store_files.is_allowed ||
        state.permissions.store_files.disabled) &&
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
