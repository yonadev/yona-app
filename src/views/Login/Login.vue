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
        Onjuiste pincode! U heeft nog {{account.loginAttempts}} pogingen.
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <router-link :to="{'name': 'WaitLocked'}">
        <p class="reset">
          PIN reset
        </p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Watch, Component } from 'vue-property-decorator';
import PinCode from '../../components/PinCode.vue';
import {Action, State} from "vuex-class";
import {AccountState} from "../../store/account/types";

@Component({
  components:{
    PinCode
  }
})
export default class Login extends Vue {
  @State('account') account!: AccountState;
  @Action('setProperty', {namespace: 'account'}) setProperty: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  mounted () {
    if (this.account.loginAttempts <= 1) {
      this.$router.push({'name': 'Locked'});
    }
  }

  @Watch('password')
  onChildChanged(val: string) {
    if(val && val.toString().length === this.length) {
      if(val == this.account.pinCode){
        this.$router.push({'name': 'Intro'});
        this.setProperty({loginAttempts: 5})
      } else if (this.account.loginAttempts > 1) {
        this.error = true;
        this.setProperty({loginAttempts: this.account.loginAttempts-1})
      } else {
        this.$router.push({'name': 'Locked'});
      }

      this.password = null;
    }
  }
}
</script>

<style lang="scss"></style>