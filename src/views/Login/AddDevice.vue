<template>
  <div id="add-device" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        DEVICE TOEVOEGEN
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/icn_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <p class="disclaimer">
        Je hebt nog niet eerder ingelogd op dit apparaat. Ga naar je primaire device (waarschijnlijk je mobiel), open Yona, vervolgens naar instellingen en klik op ‘apparaat toevoegen’. Vul vervolgens onderstaande veld(en) in.
      </p>

      <input-floating-label :validate="{required: true, mobile: true}" name="Telefoonnummer" id="mobile" class="with-border-input" label="MOBIEL TELEFOONNUMMER" type="tel" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
      <input-floating-label id="passcode" class="with-border-input" label="PASSCODE" :value.sync="passcode" type="text" icon="icn_name.svg"></input-floating-label>
    </div>
    <div class="is-centered bottom-aligned">
      <div class="button" @click="checkPasscode">INLOGGEN</div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import InputFloatingLabel from '../../components/InputFloatingLabel.vue';
  import {Watch} from "vue-property-decorator";
  import axios from "../../utils/axios/axios";
  import {State} from "vuex-class";
  import {ApiState} from "@/store/api/types";

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class AddDevice extends Vue {
    private mobile: string = '';
    private mobile_exists = false;
    private passcode: string = '';
    @State('api') api!: ApiState;

    @Watch('mobile')
    async mobileChanged(val: string | null) {
      if(val){
        if(val.charAt(0) == '0') {
          val = '+31' + val.substr(1);
          this.mobile = val
        }
      }
    }

    async checkPasscode () {
      let get_response: any = await axios.get(this.api.host + '/newDeviceRequests/'+this.mobile).catch((error) => {
        console.log(error)
      });

      if(get_response.status == 200) {
        this.mobile_exists = true;

        if(this.passcode) {
          let response: any = await axios.post(get_response.data._links['yona:registerDevice'].href, {
            //Todo: implement Cordova device info
            "operatingSystem": "ANDROID",
            "appVersion": "1.1 build 83",
            "appVersionCode": 31
          }, {
            headers: {
              "Yona-NewDeviceRequestPassword": this.passcode
            }
          }).catch((error) => {
            console.log(error)
          });

          if (response.status == 201) {
            this.$router.push({"name": "SetPinCode"});
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  #add-device{
    .bottom-aligned{
      .button{
        width:100%;
        border:0;
      }
    }
  }
</style>