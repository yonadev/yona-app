<template>
  <div
    id="sms-validation"
    class="colored-background purple-dark pincode-template"
    :loading="loading"
  >
    <div class="nav-title">
      {{ $t("login") }}
    </div>
    <div class="wrapper">
      <img src="../../assets/images/signup/account/icn_secure.svg" />
      <p class="icon-title">
        {{ $t("activateaccount") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("activateaccountPINreset") }}
      </p>
      <p v-if="error && attempts !== null" class="has-text-white-ter">
        {{ $t("wrong_sms_code", { attempts: attempts }) }}
      </p>
      <p v-else-if="attempts === null" class="has-text-white-ter">
        {{ $t("no_sms_attempts") }}
      </p>
      <pin-code
        v-if="attempts !== null"
        :pincode.sync="password"
        :length="length"
      ></pin-code>
      <p class="reset" @click="resendCode" :disabled="loading">
        {{ $t("sendotpagain") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import PinCode from "@/components/PinCode.vue";
import axios from "@/utils/axios/axios";
import { Action, State } from "vuex-class";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    PinCode,
  },
})
export default class SmsValidation extends Vue {
  @State("api") api!: ApiState;
  @Action("resetLock", { namespace: "login" }) resetLock: any;
  password: number | null = null;
  length: number = 4;
  attempts: number | null = 0;
  loading: boolean = false;
  error: boolean = false;

  async mounted() {
    await this.getLinks();
  }

  async resendCode() {
    if (
      !this.loading &&
      this.api.links &&
      this.api.links["yona:resendPinResetConfirmationCode"]
    ) {
      this.loading = true;
      await axios
        .post(this.api.links["yona:resendPinResetConfirmationCode"].href, {})
        .catch();
      this.password = null;
      this.error = false;
      this.loading = false;
      this.attempts = 0;
    }
  }

  async getLinks() {
    //Get new links
    if (this.api.links && this.api.links["self"]) {
      await axios.get(this.api.links["self"].href).catch();
    }
  }

  @Watch("password")
  async onChildChanged(val: number | null) {
    let self = this;
    if (val && val.toString().length === this.length) {
      this.loading = true;

      if (this.api.links && this.api.links["yona:verifyPinReset"]) {
        let response: any = await axios
          .post(this.api.links["yona:verifyPinReset"].href, {
            code: this.password,
          })
          .catch((error) => {
            if (error) {
              self.password = null;
              self.loading = false;
              if (error.response.status == 400) {
                self.error = true;
                if (error.response.data.remainingAttempts >= 0)
                  self.attempts = error.response.data.remainingAttempts;
                else self.attempts = null;
              }
            }
          });

        if (response) {
          if (response.status == 200) {
            await axios
              .post(this.api.links["yona:clearPinReset"].href, {
                code: this.password,
              })
              .catch();

            await this.getLinks();
            this.resetLock();

            this.$router.push({ name: "SetPinCode" });
          }
        }
      }

      this.loading = false;
      this.password = null;
    }
  }
}
</script>

<style lang="scss">
#sms-validation {
  position: relative;
  .progress-bar {
    .progress {
      width: 33%;
    }
  }
}
</style>
