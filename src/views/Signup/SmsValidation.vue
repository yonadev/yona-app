<template>
  <div
    id="sms-validation"
    class="colored-background purple-dark pincode-template"
  >
    <div class="nav-title">
      {{ $t("join") }}
    </div>
    <div class="wrapper">
      <img
        class="icon-img"
        src="../../assets/images/signup/account/add_avatar.svg"
      />
      <p class="icon-title">
        {{ $t("accountlogin") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("accountloginsecuritymessage") }}
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <router-link :to="{ name: '' }">
        <p class="reset">
          {{ $t("sendotpagain") }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import PinCode from "@/components/PinCode.vue";
import axios from "@/utils/axios/axios";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    PinCode,
  },
})
export default class SmsValidation extends Vue {
  @State("api") api!: ApiState;
  password: number | null = null;
  length: number = 4;

  @Watch("password")
  async onChildChanged(val: number | null) {
    if (val && val.toString().length === this.length) {
      if (this.api.links) {
        let response: any = await axios
          .post(this.api.links["yona:confirmMobileNumber"].href, {
            code: this.password,
          })
          .catch();

        if (response.status == 200) {
          this.$router.push({ name: "SetPinCode" });
        }
      }

      this.password = null;
    }
  }
}
</script>

<style lang="scss">
#sms-validation {
  .progress-bar {
    .progress {
      width: 33%;
    }
  }
}
</style>
