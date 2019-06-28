<template>
  <span>
    <div id="settings" class="header-template">
      <div class="colored-background yellow">
        <div class="nav-title">
          DEVICE TOEVOEGEN
        </div>
      </div>
      <div class="wrapper">
        <p>
          Vul deze code in op de andere telefoon: {{OTP}}
        </p>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {AccountState} from "@/store/account/types";
import axios from "@/utils/axios/axios"
import BottomMenu from "@/components/BottomMenu.vue";
import {ApiState} from "@/store/api/types";

@Component({
  components: {BottomMenu}
})
export default class AddDevice extends Vue {
  @State('account') account!: AccountState;
  @State('api') api!: ApiState;
  OTP: string | null = '';

  async mounted () {
    //Create an OTP of 6 mixed-case alphanumeric characters
    this.OTP = AddDevice.createOTP();

    if(this.api.links && this.api.links["yona:newDeviceRequest"]) {
      await axios.put(this.api.links["yona:newDeviceRequest"].href, {
        newDeviceRequestPassword: this.OTP
      }).catch((error) => {
        console.log(error)
      });
    }
  }

  //ToDo: This destroy also needs to be excecuted when user closes the app (Through cordova maybe?)
  async beforeDestroy () {
    if(this.api.links && this.api.links["yona:newDeviceRequest"]) {
      await axios.delete(this.api.links["yona:newDeviceRequest"].href).catch((error) => {
        console.log(error)
      });
    }
  }

  static createOTP () {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let OTP = '';

    for ( var i = 0; i < 6; i++ ) {
      OTP += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return OTP
  }
}
</script>

<style lang="scss">
  #settings{

  }
</style>