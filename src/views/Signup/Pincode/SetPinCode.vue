<template>
  <div id="pincode" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("pincode") }}
    </div>
    <div class="wrapper">
      <img
        class="icon-img"
        src="../../../assets/images/signup/account/icn_account_created.svg"
      />
      <p class="icon-title">
        {{ $t("passcodestep1title") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("passcodestep1desc") }}
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Action } from "vuex-class";
import { Watch, Component } from "vue-property-decorator";
import PinCode from "@/components/PinCode.vue";

@Component({
  components: {
    PinCode,
  },
})
export default class SetPinCode extends Vue {
  @Action("setPincode", { namespace: "login" }) setPincode: any;
  password: number | null = null;
  length: number = 4;

  @Watch("password")
  onChildChanged(val: number | null) {
    if (val && val.toString().length === this.length) {
      this.setPincode({ pinCode: val });
      this.$router.push({ name: "ConfirmPinCode" });
    }
  }
}
</script>

<style lang="scss">
#pincode {
  .progress-bar {
    .progress {
      width: 66%;
    }
  }
}
</style>
