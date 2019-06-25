<template>
  <div id="sms-validation" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      DOE MEE
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../assets/images/signup/account/add_avatar.svg"/>
      <p class="icon-title">
        Account wordt aangemaakt
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Als extra beveiliging ontvang je een code per SMS, graag deze code hieronder invullen.
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <router-link :to="{'name': ''}">
        <p class="reset">
          Stuur code opnieuw
        </p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Watch, Component } from 'vue-property-decorator'
  import PinCode from '@/components/PinCode.vue';
  import axios from "@/utils/axios/axios"
  import {State} from "vuex-class";
  import {LinksState} from "@/store/links/types";

  @Component({
    components:{
      PinCode
    }
  })
  export default class SmsValidation extends Vue {
    @State('links') links!: LinksState;
    password: number | null = null;
    length: number = 4;

    @Watch('password')
    async onChildChanged(val: number | null) {
      if(val && val.toString().length === this.length){
        if(this.links.links) {
          let response: any = await axios.post(this.links.links['yona:confirmMobileNumber'].href, {
            code: this.password
          }).catch((error) => {
            if (error) {
              console.log(error)
            }
          });

          if (response.status == 200) {
            this.$router.push({'name': 'SetPinCode'});
          }
        }

        this.password = null;
      }
    }
  }
</script>

<style lang="scss">
  #sms-validation{
    .progress-bar{
      .progress{
        width:33%;
      }
    }
  }
</style>