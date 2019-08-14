<template>
  <div id="intro" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("connect") }}
    </div>
    <div class="wrapper">
      <p class="icon-title">{{ $t("step") }} {{ parseInt(index) + 1 }}</p>
      <div class="progress-bar">
        <div class="progress" :style="'width:' + 25 * index + '%'"></div>
      </div>
      <p class="icon-text">
        {{ account.permissions[permission] ? $t(permission) : "" }}
      </p>
      <img
        class="step-icon"
        :src="
          account.permissions[permission] &&
          account.permissions[permission].icon
            ? require('@/assets/images/signup/permission/' +
                account.permissions[permission].icon)
            : ''
        "
      />
      <p class="step-text">
        {{ account.permissions[permission] ? $t("info" + permission) : "" }}
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <a class="button" @click="goNext">{{ $t("next") }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { AccountState } from "@/store/account/types";
import { Action, State } from "vuex-class";

@Component({})
export default class GivePermission extends Vue {
  @State("account") account!: AccountState;
  @Action("setPermission", { namespace: "account" }) setPermission: any;
  permission: string = "";
  index: number = 0;

  mounted() {
    //Check permission
    let i = 0;
    for (let permission in this.account.permissions) {
      if (!(this.account.permissions as any)[permission].is_allowed) {
        this.index = i;
        this.permission = permission;
        break;
      }
      i++;
    }
  }

  goNext() {
    //@ts-ignore
    if (
      //@ts-ignore
      typeof cordova !== "undefined" &&
      //@ts-ignore
      typeof cordova.plugins.YonaServices !== "undefined") {
      if (this.permission === "tracking") {
        //@ts-ignore
        cordova.plugins.YonaServices.setDefaults({
          title: "Yona",
          text: this.$t("yona_notification_content"),
          icon: "notification", // this will look for icon.png in platforms/android/res/drawable|mipmap
          color: "6c2a58", // hex format like 'F14F4D'
          resume: true,
          channelName: this.$t("yona_service_notification_channel_name"),
          allowClose: true
        });
        //@ts-ignore
        cordova.plugins.YonaServices.checkUsageAccess();
        //@ts-ignore
        cordova.plugins.YonaServices.enable();
        //@ts-ignore
        cordova.plugins.YonaServices.on("activate", function() {
          //@ts-ignore
          cordova.plugins.YonaServices.disableWebViewOptimizations();
        });
      } else if (this.permission === "autostart") {
        //@ts-ignore
        cordova.plugins.YonaServices.openAppStartSettings(false);
      }
    }
    this.setPermission({
      key: this.permission,
      value: true
    });

    this.$router.push({ name: "Intro" });
  }
}
</script>

<style lang="scss">
#intro {
  img.step-icon {
    margin-top: 40px;
    width: 100px;
  }
  .step-text {
    font-weight: 300;
    font-size: 1.2rem;
    margin-top: 30px;
    padding: 0 40px;
    color: #fff;
  }
  .bottom-aligned {
    .button {
      width: 100%;
      border: 0;
    }
  }
}
</style>
