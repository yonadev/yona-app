<template>
  <div id="account-info" class="header-template" :loading="loading">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("join") }}
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg" />
      </div>
    </div>
    <form @submit.prevent="checkTelNumber()">
      <div class="wrapper">
        <input-floating-label
          :validate="{ required: true, mobile: true }"
          id="mobile"
          class="with-border-input"
          :label="$t('mobilenumber')"
          type="tel"
          :value.sync="mobile"
          icon="icn_mobile.svg"
        ></input-floating-label>
        <input-floating-label
          :validate="{ required: true }"
          id="nickname"
          class="with-border-input"
          :label="$t('nickname')"
          type="text"
          :value.sync="nickname"
          icon="icn_nickname.svg"
        ></input-floating-label>

        <p class="api-error" v-if="server_error">
          {{ server_error }}
        </p>

        <p class="disclaimer">
          {{ $t("usersignupmessage") }}
        </p>
      </div>
      <div class="is-centered bottom-aligned">
        <router-link class="button" :to="{ name: 'Names' }">{{
          $t("previous")
        }}</router-link>
        <input type="submit" class="button" :value="$t('next')" />
      </div>
    </form>

    <div class="is-centered" v-if="choose">
      <router-link class="button" :to="{ name: 'AddDevice' }">{{
        $t("adddevice")
      }}</router-link>
      <router-link class="button" :to="{ name: 'PhoneNumber' }">{{
        $t("registeragain")
      }}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component, Prop } from "vue-property-decorator";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";
import { Action, State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import axios from "@/utils/axios/axios";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    InputFloatingLabel
  }
})
export default class AccountInfo extends Vue {
  @State("account") account!: AccountState;
  @State("api") api!: ApiState;
  @State(state => state.app.versionNumber) versionNumber!: string;
  @State(state => state.app.versionCode) versionCode!: number;
  @Action("setProperty", { namespace: "account" }) setProperty: any;
  @Action("setHeaderPassword", { namespace: "api" }) setHeaderPassword: any;
  @Prop() buddy_invite!: any;
  loading: boolean = false;
  mobile: string | null = "";
  nickname: string | null = "";
  choose: boolean = false;
  server_error: string = "";

  mounted() {
    this.mobile = this.account.phonenumber;
    this.nickname = this.account.nickname;
  }

  async checkTelNumber() {
    let self = this;
    this.$validator.validate().then(async valid => {
      if (valid && !this.loading) {
        this.loading = true;

        let OS = "ANDROID";
        //@ts-ignore
        if (typeof device !== "undefined") {
          //@ts-ignore
          OS = device.platform.toUpperCase();
        }

        let firebaseInstanceId = null;

        if (
          //@ts-ignore
          typeof cordova !== "undefined" &&
          //@ts-ignore
          typeof cordova.plugins !== undefined &&
          //@ts-ignore
          cordova.plugins.firebase
        ) {
          //@ts-ignore
          await cordova.plugins.firebase.messaging.requestPermission({
            forceShow: true
          });

          //@ts-ignore
          firebaseInstanceId = await cordova.plugins.firebase.messaging.getToken();
        }

        let response: any;

        if (this.buddy_invite && this.buddy_invite.url) {
          this.setHeaderPassword({
            yonaPassword: ""
          });

          response = await axios
            .put(this.buddy_invite.url, {
              firstName: this.account.firstname,
              lastName: this.account.lastname,
              mobileNumber: this.account.phonenumber,
              nickname: this.account.nickname,
              deviceName: `${this.$t("firstdevicename")}`,
              deviceOperatingSystem: OS,
              deviceAppVersion: this.versionNumber,
              deviceAppVersionCode: this.versionCode,
              deviceFirebaseInstanceId: firebaseInstanceId
            })
            .catch(error => {
              self.loading = false;
              if (error.response.data) {
                self.server_error = error.response.data.message;
              }
            });
        } else {
          response = await axios
            .post(this.api.host + "/users/", {
              firstName: this.account.firstname,
              lastName: this.account.lastname,
              mobileNumber: this.account.phonenumber,
              nickname: this.account.nickname,
              deviceName: `${this.$t("firstdevicename")}`,
              deviceOperatingSystem: OS,
              deviceAppVersion: this.versionNumber,
              deviceAppVersionCode: this.versionCode,
              deviceFirebaseInstanceId: firebaseInstanceId
            })
            .catch(error => {
              self.loading = false;
              if (
                error.response.data.code === "error.user.exists" ||
                error.response.data.code ===
                  "error.user.exists.created.on.buddy.request"
              ) {
                //@ts-ignore
                if (navigator && navigator.notification) {
                  //@ts-ignore
                  navigator.notification.confirm(
                    self.$t("useroverride"),
                    (result: number) => {
                      if (result === 2) {
                        self.$router.push({ name: "PhoneNumber" });
                      } else if (result === 1) {
                        self.$router.push({ name: "AddDevice" });
                      }
                    },
                    error.response.data.message,
                    [self.$t("no"), self.$t("yes")]
                  );
                } else {
                  self.choose = true;
                }
                self.server_error = error.response.data.message;
              } else if (error.response.data) {
                self.server_error = error.response.data.message;
              }
            });
        }

        this.loading = false;

        if (response) {
          if (response.status === 201 || response.status === 200) {
            //Successfull
            this.$router.push({ name: "SmsValidation" });
          } else if (response.status !== 201) {
            //Probably a field missing
            this.choose = true;
          }
        }
      }
    });
  }

  @Watch("mobile")
  mobileChanged(val: string | null) {
    if (val) {
      if (val.charAt(0) === "0" && val.charAt(1) === "6") {
        val = "+31" + val.substr(1);
        this.mobile = val;
      }

      this.setProperty({ phonenumber: val });
    }
  }
  @Watch("nickname")
  nicknameChanged(val: string | null) {
    if (val) this.setProperty({ nickname: val });
  }
}
</script>

<style lang="scss"></style>
