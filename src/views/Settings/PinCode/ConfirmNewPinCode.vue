<template>
  <div
    id="confirm-new-pincode"
    class="colored-background yellow pincode-template"
  >
    <div class="nav-title">
      {{ $t("changepin") }}
    </div>
    <div class="wrapper">
      <img
        class="icon-img"
        src="../../../assets/images/signup/account/icn_account_created.svg"
      />
      <p class="icon-title">
        {{ $t("settings_confirm_new_pin") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("settings_confirm_new_pin_message") }}
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
import { Watch, Component, Prop } from "vue-property-decorator";
import PinCode from "@/components/PinCode.vue";
import { Action } from "vuex-class";

@Component({
  components: {
    PinCode,
  },
})
export default class ConfirmPinCode extends Vue {
  @Prop() pincode!: any;
  @Action("setPincode", { namespace: "login" }) setPincode: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  @Watch("password")
  onChildChanged(val: number | null) {
    if (val && val.toString().length === this.length) {
      if (val === this.pincode) {
        this.setPincode({ pinCode: val });
        this.$router.push({ name: "Settings" });
      } else {
        this.$router.push({
          name: "ChangePinCode",
          params: { wrong_pincode: "true" },
        });
      }
    }
  }
}
</script>

<style lang="scss">
#confirm-new-pincode {
  .progress-bar {
    .progress {
      width: 100%;
    }
  }
}
</style>
