<template>
  <div id="add-device" class="header-template" :loading="loading">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("adddevice") }}
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/icn_avatar.svg" />
      </div>
    </div>
    <form @submit.prevent="checkPasscode()">
      <div class="wrapper">
        <p class="disclaimer">
          {{ $t("loggedinadddevicemessage") }}
        </p>

        <input-floating-label
          :validate="{ required: true }"
          id="device_name"
          class="with-border-input"
          :label="$t('device_name')"
          type="text"
          :value.sync="device_name"
          icon="icn_mobile.svg"
        ></input-floating-label>
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
          id="passcode"
          :validate="{ required: true }"
          class="with-border-input"
          :label="$t('passcode')"
          :value.sync="passcode"
          type="text"
          icon="icn_name.svg"
        ></input-floating-label>
      </div>
      <div class="is-centered bottom-aligned">
        <input type="submit" class="button" :value="$t('login')" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import InputFloatingLabel from "../../components/InputFloatingLabel.vue";
import { Inject, Watch } from "vue-property-decorator";
import axios from "../../utils/axios/axios";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import { Validator } from "vee-validate";

@Component({
  components: {
    InputFloatingLabel
  }
})
export default class AddDevice extends Vue {
  loading: boolean = false;
  mobile: string | null = "";
  mobile_exists = false;
  passcode: string | null = "";
  device_name: string | null = "";
  @State("api") api!: ApiState;
  @State(state => state.app.versionNumber) versionNumber!: string;
  @State(state => state.app.versionCode) versionCode!: number;

  @Watch("mobile")
  async mobileChanged(val: string | null) {
    if (val) {
      if (val.charAt(0) === "0" && val.charAt(1) === "6") {
        val = "+31" + val.substr(1);
        this.mobile = val;
      }
    }
  }

  async checkPasscode() {
    this.$validator.validate().then(async valid => {
      if (valid && !this.loading) {
        this.loading = true;

        let get_response: any = await axios.get(
          this.api.host + "/newDeviceRequests/" + this.mobile
        );

        this.loading = false;

        if (get_response && get_response.status == 200) {
          this.mobile_exists = true;

          if (this.passcode) {
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

            let response: any = await axios
              .post(
                get_response.data._links["yona:registerDevice"].href,
                {
                  operatingSystem: OS,
                  name: this.device_name,
                  appVersion: this.versionNumber,
                  appVersionCode: this.versionCode,
                  firebaseInstanceId
                },
                {
                  headers: {
                    "Yona-NewDeviceRequestPassword": this.passcode
                  }
                }
              )
              .catch();

            if (response) {
              this.$router.push({ name: "SetPinCode" });
            }
          }
        }
      }
    });
  }
}
</script>

<style lang="scss">
#add-device {
  .bottom-aligned {
    .button {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border: 0;
      z-index: 10;
    }
  }
}
</style>
