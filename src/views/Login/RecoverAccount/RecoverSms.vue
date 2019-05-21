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
  import PinCode from '../../../components/PinCode.vue';
  import axios from "../../../utils/axios/axios"
  import {State} from "vuex-class";
  import {AccountState} from "../../../store/account/types";

  @Component({
    components:{
      PinCode
    }
  })
  export default class RecoverSms extends Vue {
    @State('account') account!: AccountState;
    password: number | null = null;
    length: number = 4;

    @Watch('password')
    onChildChanged(val: number) {
      if(val.toString().length === this.length) {
        let self = this
        this.$validator.validate().then(async valid => {
          if (valid) {
            let response: any = await axios.post('http://192.168.1.9:8082/users/?overwriteUserConfirmationCode='+val, {
              firstName: this.account.firstname,
              lastName: this.account.lastname,
              mobileNumber: this.account.phonenumber,
              nickname: this.account.nickname
            }).catch((error) => {
              console.log(error)
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