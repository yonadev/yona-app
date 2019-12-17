<template>
  <div id="add-device" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("join") }}
      </div>
      <div class="header-icon">
        <img src="../../../assets/images/signup/account/icn_avatar.svg" />
      </div>
    </div>
    <form @submit.prevent="checkTelNumber()">
      <div class="wrapper">
        <p class="disclaimer">
          {{ $t("useroverride", { mobile: mobile }) }}
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
import InputFloatingLabel from "../../../components/InputFloatingLabel.vue";
import axios from "../../../utils/axios/axios";
import { Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    InputFloatingLabel
  }
})
export default class PhoneNumber extends Vue {
  @State("account") account!: AccountState;
  @State("api") api!: ApiState;
  @Action("setProperty", { namespace: "account" }) setProperty: any;
  mobile: string = "";
  loading: boolean = false;

  mounted() {
    this.mobile = this.account.phonenumber;
  }

  @Watch("mobile")
  mobileChanged(val: string | null) {
    if (val) {
      if (val.charAt(0) == "0") {
        val = "+31" + val.substr(1);
        this.mobile = val;
      }
    }
  }

  checkTelNumber() {
    let self = this;
    this.$validator.validate().then(async valid => {
      if (valid && !self.loading) {
        self.loading = true;
        this.setProperty({ phonenumber: self.mobile });

        let response: any = await axios
          .post(
            this.api.host +
              "/admin/requestUserOverwrite/?mobileNumber=" +
              encodeURIComponent(self.mobile)
          )
          .catch();
        self.loading = false;
        if (response) {
          //Successfull
          this.$router.push({ name: "RecoverSms" });
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
