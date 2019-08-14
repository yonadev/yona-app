<template>
  <div id="add-device" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("adddevice") }}
      </div>
    </div>
    <div class="wrapper">
      <p>
        {{ $t("yonaadddevicemessage") }}

        <span class="otp">
          <span class="char" v-for="(char, index) in OTP" :key="index">{{
            char
          }}</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import axios from "@/utils/axios/axios";
import { ApiState } from "@/store/api/types";

@Component({})
export default class AddDevice extends Vue {
  @State("account") account!: AccountState;
  @State("api") api!: ApiState;
  OTP: string | null = "";

  async mounted() {
    //Create an OTP of 6 mixed-case alphanumeric characters
    this.OTP = AddDevice.createOTP();

    if (this.api.links && this.api.links["yona:newDeviceRequest"]) {
      await axios
        .put(this.api.links["yona:newDeviceRequest"].href, {
          newDeviceRequestPassword: this.OTP
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  //ToDo: This destroy also needs to be excecuted when user closes the app (Through cordova maybe?)
  async beforeDestroy() {
    if (this.api.links && this.api.links["yona:newDeviceRequest"]) {
      await axios
        .delete(this.api.links["yona:newDeviceRequest"].href)
        .catch(error => {
          console.log(error);
        });
    }
  }

  static createOTP() {
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let OTP = "";

    for (var i = 0; i < 6; i++) {
      OTP += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return OTP;
  }
}
</script>

<style lang="scss">
#add-device {
  .wrapper {
    padding-top: 15px;
    font-size: 13px;

    span.otp {
      margin-top: 25px;
      display: block;
      font-size: 19px;
      font-family: serif;

      span.char {
        background: white;
        border: 1px solid lightgrey;
        padding: 8px;
        min-width: 16px;
        display: inline-block;
        margin-left: 5px;
      }
    }
  }
}
</style>
