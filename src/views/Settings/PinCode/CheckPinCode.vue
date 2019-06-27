<template>
  <div id="check-pincode" class="colored-background yellow pincode-template">
    <div class="nav-title">
      WIJZIG PINCODE
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Huidige pincode
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Om je pincode te wijzigen vragen we je eerst je oude pincode in te voeren.
      </p>
      <p class="icon-text" v-if="error">
        De pincode is onjuist!
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <router-link :to="{'name': 'ChangeLocked'}">
        <p class="reset">
          PIN reset
        </p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Watch, Component } from 'vue-property-decorator'
  import PinCode from '@/components/PinCode.vue';
  import { State } from 'vuex-class';
  import {LoginState} from "@/store/login/types";

  @Component({
    components:{
      PinCode
    }
  })
  export default class CheckPinCode extends Vue {
    @State('login') login!: LoginState;
    private password: number | null = null;
    private length: number = 4;
    private error: boolean = false;

    @Watch('password')
    onChildChanged(val: number) {
      if(val && val.toString().length === this.length){
        if(val == this.login.pinCode)
          this.$router.push({'name': 'ChangePinCode'});
        else{
          this.error = true;
          this.password = null;
        }
      }
    }
  }
</script>

<style lang="scss">
  #check-pincode{
    .progress-bar{
      .progress{
        width:33%;
      }
    }
    .reset{
      color:#fff;
      opacity:0.5;
    }
  }
</style>