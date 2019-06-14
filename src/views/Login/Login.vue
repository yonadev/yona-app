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
import {toSeconds, parse} from 'iso8601-duration';
import {LoginState} from "../../store/login/types";
import {LinksState} from "../../store/links/types";

@Component({
  components:{
    PinCode
  }
})
export default class Login extends Vue {
  @State('login') login!: LoginState;
  @State('links') links!: LinksState;
  @Action('setProperty', {namespace: 'login'}) setProperty: any;
  @Action('setUserData', {namespace: 'account'}) setUserData: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  mounted () {
    if (this.login.loginAttempts <= 1) {
      this.$router.push({'name': 'Locked'});
    }
  }

  async pinReset () {
    if(this.links.links["yona:requestPinReset"]) {
      let response = await axios.post(this.links.links["yona:requestPinReset"].href, {}
      ).catch((error) => {
        console.log(error)
      });

      if(response) {
        let date = new Date();
        let seconds = parseInt(date.getTime()/1000)
        seconds += toSeconds(parse(response.data.delay))

        this.setProperty({locked_timer: seconds})

        if (response.status === 200) {
          //Successfull
          this.$router.push({'name': 'WaitLocked'});
        }
      }
    }
  }

  @Watch('password')
  async onChildChanged(val: string) {
    if(val && val.toString().length === this.length) {
      if(val == this.login.pinCode){
        let user_response: any = await axios.get(this.links.links['self'].href).catch((error) => {
          console.log(error)
        });

        if(user_response)
          this.setUserData(user_response.data)

        let photo_response: any = await axios.get(this.links.links['yona:userPhoto'].href, {
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

        this.$router.push({'name': 'Intro'});
        this.setProperty({loginAttempts: 5})
      } else if (this.login.loginAttempts > 1) {
        this.error = true;
        this.setProperty({loginAttempts: this.login.loginAttempts-1})
      } else {
        this.$router.push({'name': 'Locked'});
      }

      this.password = null;
    }
  }
}
</script>

<style lang="scss"></style>