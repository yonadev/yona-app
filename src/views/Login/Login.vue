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
        Onjuiste pincode! U heeft nog {{login.loginAttempts}} pogingen.
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
              responseType: 'blob'
            }).catch((error) => {
              console.log(error)
            });

            let self = this

            if (FileReader && photo_response.data) {
              var fr = new FileReader();
              fr.onload = await function () {
                self.setProperty({userphoto: fr.result})
              }
              fr.readAsDataURL(photo_response.data);
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