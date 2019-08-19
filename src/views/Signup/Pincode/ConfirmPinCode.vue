<template>
  <div
    id="confirm-pincode"
    class="colored-background purple-dark pincode-template"
    :loading="loading"
  >
    <div class="nav-title">
      {{ $t("pincode") }}
    </div>
    <div class="wrapper">
      <img
        class="icon-img"
        src="../../../assets/images/signup/account/icn_secure.svg"
      />
      <p class="icon-title">
        {{ $t("passcodestep2title") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("passcodestep2desc") }}
      </p>
      <p class="icon-text" v-if="error">
        {{ $t("passcodestep1retrytitle") }}
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
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
export default class ConfirmPinCode extends Vue {
  @State("login") login!: LoginState;
  @Action("resetLock", { namespace: "login" }) resetLock: any;
  @Action("setRegistered", { namespace: "login" }) setRegistered: any;
  private password: number | null = null;
  private length: number = 4;
  private error: boolean = false;
  private loading: boolean = false;

  @Watch("password")
  async onChildChanged(val: number | null) {
    if (val && val.toString().length === this.length) {
      if (val === this.login.pinCode) {
        this.loading = true;
        this.resetLock();
        await this.setRegistered();
        this.loading = false;
      } else {
        this.error = true;
        this.password = null;
      }
    }
  }
}
</script>

<style lang="scss">
#confirm-pincode {
  .progress-bar {
    .progress {
      width: 100%;
    }
  }
}
</style>
