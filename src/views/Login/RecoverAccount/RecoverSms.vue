<template>
  <div id="pincode" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("join") }}
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/add_avatar.svg" />
      <p class="icon-title">
        {{ $t("accountlogin") }}
      </p>
      <div class="progress-bar">
        <div class="progress" style="width: 33%"></div>
      </div>
      <p class="icon-text">
        {{ $t("accountloginsecuritymessage") }}
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
      <p class="reset" @click="resendCode">
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
import { State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    PinCode,
  },
})
export default class RecoverSms extends Vue {
  @State("account") account!: AccountState;
  @State("api") api!: ApiState;
  @State((state) => state.app.versionNumber) versionNumber!: string;
  @State((state) => state.app.versionCode) versionCode!: number;

  password: number | null = null;
  length: number = 4;
  attempts: number | null = 0;
  error: boolean = false;

  async resendCode() {
    await axios
      .post(
        this.api.host +
          "/admin/requestUserOverwrite/?mobileNumber=" +
          encodeURIComponent(this.account.phonenumber)
      )
      .catch();
    this.password = null;
    this.error = false;
    this.attempts = 0;
  }

  getFirebaseToken() {
    return new Promise(function (resolve, reject) {
      (window as any).FirebasePlugin.getToken(
        function (fcmToken: string) {
          resolve(fcmToken);
        },
        function (error: string) {
          reject(error);
        }
      );
    });
  }

  @Watch("password")
  onChildChanged(val: number) {
    if (val && val.toString().length === this.length) {
      let self = this;
      this.$validator.validate().then(async (valid) => {
        if (valid) {
          let OS = "ANDROID";
          //@ts-ignore
          if (typeof device !== "undefined") {
            //@ts-ignore
            OS = device.platform.toUpperCase();
          }

          let firebaseInstanceId = null;

          if (typeof (window as any).FirebasePlugin !== "undefined") {
            firebaseInstanceId = await this.getFirebaseToken();
          }

          let response: any = await axios
            .post(
              this.api.host + "/users/?overwriteUserConfirmationCode=" + val,
              {
                firstName: this.account.firstname,
                lastName: this.account.lastname,
                mobileNumber: this.account.phonenumber,
                nickname: this.account.nickname,
                deviceName: `${this.$t("firstdevicename")}`,
                deviceOperatingSystem: OS,
                deviceAppVersion: this.versionNumber,
                deviceAppVersionCode: this.versionCode,
                deviceFirebaseInstanceId: firebaseInstanceId,
              }
            )
            .catch((error) => {
              if (error) {
                self.password = null;
                if (error.response.status == 400) {
                  self.error = true;
                  if (error.response.data.remainingAttempts >= 0)
                    self.attempts = error.response.data.remainingAttempts;
                  else self.attempts = null;
                }
              }
            });

          if (response) {
            if (response.status === 201) {
              //Successfull
              this.$router.push({ name: "SetPinCode" });
            } else {
              //Error
            }
          }

          self.password = null;
        }
      });
    }
  }
}
</script>

<style lang="scss"></style>
