<template>
  <div id="sms-validation" class="colored-background purple-dark pincode-template" :loading="loading">
    <div class="nav-title">
      INLOGGEN
    </div>
    <div class="wrapper">
      <img src="../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Account activeren
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Je hebt een PIN reset code gekregen per SMS, graag deze code hieronder invullen.
      </p>
      <p v-if="error && attempts !== null" class="has-text-white-ter">
        Onjuiste reset code! U heeft nog {{attempts}} resterende pogingen.
      </p>
      <p v-else-if="attempts === null" class="has-text-white-ter">
        U heeft geen pogingen meer, vraag een nieuwe code aan!
      </p>
      <pin-code v-if="attempts !== null" :pincode.sync="password" :length="length"></pin-code>
      <p class="reset" @click="resendCode">
        Stuur code opnieuw
      </p>
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
    attempts: number | null = 0;
    loading: boolean = false;
    error: boolean = false;

    async mounted () {
      await this.getLinks()
    }

    async resendCode () {
      if(this.links.links && this.links.links['yona:resendPinResetConfirmationCode']) {
        await axios.post(this.links.links['yona:resendPinResetConfirmationCode'].href, {}).catch((error) => {
          if (error) {
            console.log(error)
          }
        });
        this.password = null
        this.error = false
        this.attempts = 0
      }
    }

    async getLinks(){
      //Get new links
      if(this.links.links && this.links.links['self']) {
        await axios.get(this.links.links["self"].href
        ).catch((error) => {
          console.log(error)
        });
      }
    }

    @Watch('password')
    async onChildChanged(val: number | null) {
      let self = this
      if(val && val.toString().length === this.length){
        this.loading = true;

        if(this.links.links && this.links.links['yona:verifyPinReset']) {
          let response: any = await axios.post(this.links.links['yona:verifyPinReset'].href, {
            code: this.password
          }).catch((error) => {
            if (error) {
              self.password = null
              self.loading = false
              if (error.response.status == 400) {
                self.error = true
                if (error.response.data.remainingAttempts >= 0)
                  self.attempts = error.response.data.remainingAttempts
                else
                  self.attempts = null
              }
            }
          });

          if (response) {
            if (response.status == 200) {
              await axios.post(this.links.links['yona:clearPinReset'].href, {
                code: this.password
              }).catch((error) => {
                if (error) {
                  console.log(error)
                }
              });

              await this.getLinks()

              this.$router.push({'name': 'SetPinCode'});
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
  #sms-validation{
    position: relative;
    .progress-bar{
      .progress{
        width:33%;
      }
    }
  }
</style>