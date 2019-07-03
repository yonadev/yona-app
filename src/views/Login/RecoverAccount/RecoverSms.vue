<template>
  <div id="pincode" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      OPNIEUW REGISTREREN
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/add_avatar.svg"/>
      <p class="icon-title">
        Account wordt aangemaakt
      </p>
      <div class="progress-bar">
        <div class="progress" style="width:33%;"></div>
      </div>
      <p class="icon-text">
        Als extra beveiliging ontvang je een code per SMS, graag deze code hieronder invullen.
      </p>
      <p v-if="error && attempts !== null" class="has-text-white-ter">
        Onjuiste SMS code! U heeft nog {{attempts}} resterende pogingen.
      </p>
      <p v-else-if="attempts === null" class="has-text-white-ter">
        U heeft geen pogingen meer, vraag een nieuwe SMS code aan!
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
  import {AccountState} from "@/store/account/types";
  import {ApiState} from "@/store/api/types";

  @Component({
    components:{
      PinCode
    }
  })
  export default class RecoverSms extends Vue {
    @State('account') account!: AccountState;
    @State('api') api!: ApiState;
    password: number | null = null;
    length: number = 4;
    attempts: number | null = 0;
    error: boolean = false;

    async resendCode(){
      await axios.post(this.api.host + '/admin/requestUserOverwrite/?mobileNumber='+encodeURIComponent(this.account.phonenumber)).catch((error) => {
        console.log(error)
      });
      this.password = null
      this.error = false
      this.attempts = 0
    }

    @Watch('password')
    onChildChanged(val: number) {
      if(val && val.toString().length === this.length) {
        let self = this
        this.$validator.validate().then(async valid => {
          if (valid) {
            let response: any = await axios.post(this.api.host + '/users/?overwriteUserConfirmationCode='+val, {
              firstName: this.account.firstname,
              lastName: this.account.lastname,
              mobileNumber: this.account.phonenumber,
              nickname: this.account.nickname
            }).catch((error) => {
              console.log(error)
              if(error){
                self.password = null
                if(error.response.status == 400){
                  self.error = true
                  if(error.response.data.remainingAttempts >= 0)
                    self.attempts = error.response.data.remainingAttempts
                  else
                    self.attempts = null
                }
              }
            });

            if(response) {
              if (response.status === 201) {
                //Successfull
                this.$router.push({'name': 'SetPinCode'});
              } else {
                //Error
              }
            }

            self.password = null
          }
        });
      }
    }
  }
</script>

<style lang="scss"></style>