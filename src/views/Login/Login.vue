<template>
  <div id="login" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      INLOGGEN
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../assets/images/login/icn_y.png"/>
      <p class="icon-title">
        You are not alone
      </p>
      <p v-if="error" class="has-text-white-ter">
        Onjuiste pincode! U heeft nog {{5-login.loginAttempts}} pogingen.
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <p class="reset" @click="pinReset">
        PIN reset
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Watch, Component } from 'vue-property-decorator';
import PinCode from '../../components/PinCode.vue';
import axios from "../../utils/axios/axios"
import {Action, State} from "vuex-class";
import {LoginState} from "@/store/login/types";
import {ApiState} from "@/store/api/types";

@Component({
  components:{
    PinCode
  }
})
export default class Login extends Vue {
  @State('login') login!: LoginState;
  @Action('setLoggedIn', {namespace: 'login'}) setLoggedIn: any;
  @Action('increaseLoginAttempts', {namespace: 'login'}) increaseLoginAttempts: any;
  @State('api') api!: ApiState;
  @Action('setProperty', {namespace: 'login'}) setProperty: any;
  @Action('setUserData', {namespace: 'account'}) setUserData: any;
  @Action('pinReset', {namespace: 'login'}) pinReset: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  @Watch('password')
  async onChildChanged(val: number) {
    if(val && val.toString().length === this.length) {
      if(val === this.login.pinCode){
        if(this.api.links) {
          let user_response: any = await axios.get(this.api.links['self'].href).catch((error) => {
            console.log(error)
          });

          if (user_response)
            this.setUserData(user_response.data)

          if(this.api.links['yona:userPhoto']) {
            let photo_response: any = await axios.get(this.api.links['yona:userPhoto'].href, {
              responseType: 'arraybuffer'
            }).catch((error) => {
              console.log(error)
            });

            if(photo_response){
              //@ts-ignore
              const userPhoto = new Buffer(photo_response.data, 'binary').toString('base64')
              window.localStorage.setItem('user_image', JSON.stringify({type: 'me', src: 'data:image/png;base64,'+userPhoto}));
            }
          } else {
            const user_image = window.localStorage.getItem('user_image');

            if(!user_image){
              window.localStorage.setItem('user_image', JSON.stringify({type: 'me', text: user_response.data.firstName.charAt(0) + user_response.data.lastName.charAt(0)}));
            }
          }

          this.setLoggedIn();
        }
      }  else {
        this.error = true;
        this.increaseLoginAttempts();
      }
      this.password = null;
    }
  }
}
</script>

<style lang="scss"></style>