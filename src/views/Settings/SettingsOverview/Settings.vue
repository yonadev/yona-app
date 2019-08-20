<template>
  <div id="settings" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("settings") }}
      </div>
    </div>
    <div class="wrapper">
      <router-link :to="{ name: 'CheckPinCode' }">
        <div class="grey-bg-button">
          <strong>{{ $t("changepin") }}</strong>
        </div>
      </router-link>
      <router-link :to="{ name: 'Privacy' }">
        <div class="grey-bg-button">
          <strong>{{ $t("privacy") }}</strong>
        </div>
      </router-link>
      <router-link :to="{ name: 'Devices' }">
        <div class="grey-bg-button">
          <strong>{{ $t("devices") }}</strong>
        </div>
      </router-link>
      <div class="grey-bg-button" @click="contactUs()">
        <strong>{{ $t("contact_us") }}</strong>
      </div>
      <div class="grey-bg-button" @click="getVpnProfile()" v-if="1 == 2">
        <strong>Get VPN Profile</strong>
      </div>
      <router-link :to="{ name: 'Unsubscribe' }">
        <div class="grey-bg-button">
          <strong>{{ $t("deleteuser") }}</strong>
        </div>
      </router-link>

      <div class="app_version">
        Version: {{ versionNumber }} {{ versionCode }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";

@Component({})
export default class Settings extends Vue {
  @State("api") api!: ApiState;
  @State("versionNumber") versionNumber!: string;
  @State("versionCode") versionCode!: number;

  contactUs() {
    const self = this;
    let OS = "ANDROID";
    let OS_ver = "";
    let brand = "";
    let model = "";
    let base_url = "";
    //@ts-ignore
    if (typeof device !== "undefined") {
      //@ts-ignore
      OS = device.platform.charAt(0).toUpperCase() + device.platform.slice(1);
      //@ts-ignore
      OS_ver = device.version;
      //@ts-ignore
      brand = device.manufacturer;
      //@ts-ignore
      model = device.model;
    }

    if (self.api.links) {
      base_url = self.api.links.self.href;
    }

    //@ts-ignore
    if (navigator && navigator.notification) {
      //@ts-ignore
      navigator.notification.confirm(
        self.$t("usercredentialmsg"),
        (result: number) => {
          //@ts-ignore
          cordova.plugins.email.open({
            to: ["support@yona.nu"],
            subject: self.$t("support_mail_subject"),
            body:
              `Base URL: ${base_url} <br/><br/>` +
              (result === 2
                ? `Password: ${self.api.yonaPassword} <br/><br/>`
                : "") +
              `App version: ${this.versionNumber} <br/>` +
              `App version code: ${this.versionCode} <br/>` +
              `${OS} version: ${OS_ver} <br/>` +
              `Device brand: ${brand} <br/>` +
              `Device model: ${model} <br/>`,
            isHtml: true
          });
        },
        self.$t("usercredential"),
        [self.$t("no"), self.$t("yes")]
      );
    } else {
      window.location.href =
        `mailto:support@yona.nu?SUBJECT=${self.$t(
          "support_mail_subject"
        )}&BODY=` +
        `Base URL%3A ${escape(base_url)} %0D%0A%0D%0A` +
        `Password%3A ${self.api.yonaPassword} %0D%0A%0D%0A` +
        `App version%3A ${this.versionNumber} %0D%0A` +
        `App version code%3A ${this.versionCode} %0D%0A` +
        `${OS} version%3A ${OS_ver} %0D%0A` +
        `Device brand%3A ${brand} %0D%0A` +
        `Device model%3A ${model} %0D%0A`;
    }
  }

  async getVpnProfile() {
    if (
      this.api.embedded &&
      typeof this.api.embedded["yona:devices"] !== "undefined"
    ) {
      const device = this.api.embedded["yona:devices"]._embedded[
        "yona:devices"
      ].find(device => {
        return device.requestingDevice;
      });

      if (typeof device !== "undefined") {
        console.log(device.vpnProfile);
        const vpnProfile = await axios.get(
          device.vpnProfile._links["yona:ovpnProfile"].href
        );
        console.log(vpnProfile);

        //@ts-ignore
        if (typeof cordova.plugins.appUsage !== "undefined") {
          //@ts-ignore
          cordova.plugins.appUsage.startVPN({
            vpnConfig: vpnProfile.data,
            vpnLoginId: device.vpnProfile.vpnLoginID,
            vpnPassword: device.vpnProfile.vpnPassword
          });
        }
      }
    }
  }
}
</script>

<style lang="scss">
#settings {
  .nav-title {
    padding: 30px 15px 15px 30px;
  }
  .wrapper {
    padding: 0;
    .grey-bg-button {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 20px 25px 20px 25px;
      text-align: left;
    }

    .app_version {
      position: absolute;
      bottom: 65px;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
