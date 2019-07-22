<template>
  <div id="check-pincode" class="colored-background yellow pincode-template">
    <div class="nav-title">
      {{ $t("changepin") }}
    </div>
    <div class="wrapper">
      <img
        class="icon-img"
        src="../../../assets/images/signup/account/icn_secure.svg"
      />
      <p class="icon-title">
        {{ $t("settings_current_pin") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("settings_current_pin_message") }}
      </p>
      <p class="icon-text" v-if="error">
        {{ $t("passcodeincorrect", { tries: 5 - login.loginAttempts }) }}
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <p class="reset" @click="pinReset({ view: 'changePin' })">
        {{ $t("passcodereset") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import PinCode from "@/components/PinCode.vue";
import { Action, State } from "vuex-class";
import { LoginState } from "@/store/login/types";

@Component({
  components: {
    PinCode
  }
})
export default class CheckPinCode extends Vue {
  @State("login") login!: LoginState;
  @Action("setLoggedIn", { namespace: "login" }) setLoggedIn: any;
  @Action("increaseLoginAttempts", { namespace: "login" })
  increaseLoginAttempts: any;
  @Action("pinReset", { namespace: "login" }) pinReset: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  @Watch("password")
  onChildChanged(val: number) {
    if (val && val.toString().length === this.length) {
      if (val == this.login.pinCode) {
        this.setLoggedIn({ view: "changePin" });
        this.$router.push({
          name: "ChangePinCode",
          params: { wrong_pincode: "false" }
        });
      } else {
        this.increaseLoginAttempts({ view: "changePin" });

        this.error = true;
        this.password = null;
      }
    }
  }
}
</script>

<style lang="scss">
#check-pincode {
  .progress-bar {
    .progress {
      width: 33%;
    }
  }
  .reset {
    color: #fff;
    opacity: 0.5;
  }
}
</style>
