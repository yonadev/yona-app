<template>
  <div id="login" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("login") }}
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../assets/images/login/icn_y.png" />
      <p class="icon-title">
        {{ $t("passcodetitle") }}
      </p>
      <p v-if="error" class="has-text-white-ter">
        {{ $t("passcodeincorrect", { tries: 5 - login.loginAttempts }) }}
      </p>
      <pin-code
        :pincode.sync="password"
        :length="length"
        ref="pincode"
      ></pin-code>
      <p class="reset" @click="confirmPinReset">
        {{ $t("passcodereset") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import PinCode from "../../components/PinCode.vue";
import axios from "@/utils/axios/axios";
import { Action, State } from "vuex-class";
import { LoginState } from "@/store/login/types";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    PinCode,
  },
})
export default class Login extends Vue {
  @State("login") login!: LoginState;
  @Action("setLoggedIn", { namespace: "login" }) setLoggedIn: any;
  @Action("setOffline", { namespace: "api" }) setOffline: any;
  @Action("increaseLoginAttempts", { namespace: "login" })
  increaseLoginAttempts: any;
  @State("api") api!: ApiState;
  @Action("setProperty", { namespace: "login" }) setProperty: any;
  @Action("setUserData", { namespace: "account" }) setUserData: any;
  @Action("pinReset", { namespace: "login" }) pinReset: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  confirmPinReset() {
    const self = this;

    //@ts-ignore
    if (navigator && navigator.notification) {
      //@ts-ignore
      navigator.notification.confirm(
        self.$t("resetpinalert"),
        (result: number) => {
          if (result === 2) {
            self.pinReset();
          }
        },
        "",
        [self.$t("cancel"), self.$t("yes")]
      );
    } else {
      //@ts-ignore
      if (confirm(self.$t("resetpinalert"))) {
        self.pinReset();
      }
    }
  }

  @Watch("password")
  async onChildChanged(val: number) {
    if (val && val.toString().length === this.length) {
      if (!this.api.online) {
        this.setOffline();
        return;
      }
      if (val === this.login.pinCode) {
        if (this.api.links) {
          const success = await this.setUserData();

          if (!success) {
            return;
          }

          if (
            //@ts-ignore
            typeof cordova !== "undefined" &&
            //@ts-ignore
            typeof cordova.plugins.YonaServices !== "undefined"
          ) {
            //@ts-ignore
            await cordova.plugins.YonaServices.postActivitiesToServer();
          }

          this.setLoggedIn(true);
        }
      } else {
        this.error = true;
        this.increaseLoginAttempts();
      }
      this.password = null;
    }
  }
}
</script>

<style lang="scss"></style>
