<template>
  <div id="add-device" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("adddevice") }}
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/icn_avatar.svg" />
      </div>
    </div>
    <div class="wrapper">
      <p class="disclaimer">
        {{ $t("loggedinadddevicemessage") }}
      </p>

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
        :label="$t('pincode')"
        :value.sync="passcode"
        type="text"
        icon="icn_name.svg"
      ></input-floating-label>
    </div>
    <div class="is-centered bottom-aligned">
      <div class="button" @click="checkPasscode">{{ $t("login") }}</div>
    </div>
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
  mobile: string | null = "";
  mobile_exists = false;
  passcode: string | null = "";
  @State("api") api!: ApiState;

  @Watch("mobile")
  async mobileChanged(val: string | null) {
    if (val) {
      if (val.charAt(0) === "0" && val.charAt(1) === "6") {
        val = "+31" + val.substr(1);
        this.mobile = val;
      }
    }
  }

  checkPasscode() {
    this.$validator.validate().then(async valid => {
      if (valid) {
        let get_response: any = await axios
          .get(this.api.host + "/newDeviceRequests/" + this.mobile)
          .catch(error => {
            console.log(error);
          });

        if (get_response.status == 200) {
          this.mobile_exists = true;

          if (this.passcode) {
            let response: any = await axios
              .post(
                get_response.data._links["yona:registerDevice"].href,
                {
                  //Todo: implement Cordova device info
                  operatingSystem: "ANDROID",
                  appVersion: "1.1 build 83",
                  appVersionCode: 31,
                  firebaseInstanceId:
                    "d3cIznsu5VQ:APA91bGWLq7xBK1RDkpGURdliHb-S_nCBLqYnXhEWfGnItP_qGDZ6f2EF1mB66yHdBiicggV7APIWwkQXTUq_zJgwPkJtvcdqpUphYN7p8E8Sq02_ErljVApX8-n9-nvVxiyqmUg9ALZ"
                },
                {
                  headers: {
                    "Yona-NewDeviceRequestPassword": this.passcode
                  }
                }
              )
              .catch(error => {
                console.log(error);
              });

            if (response.status == 201) {
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
      width: 100%;
      border: 0;
    }
  }
}
</style>
