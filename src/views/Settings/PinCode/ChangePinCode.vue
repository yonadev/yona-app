<template>
  <div id="change-pincode" class="colored-background yellow pincode-template">
    <div class="nav-title">
      WIJZIG PINCODE
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../../assets/images/signup/account/icn_account_created.svg"/>
      <p class="icon-title">
        Nieuwe pincode
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Vul je nieuwe pincode in.
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Watch, Component } from 'vue-property-decorator'
  import PinCode from '../../../components/PinCode.vue';
  import {Action, State} from 'vuex-class';
  import {LoginState} from "../../../store/login/types";

  @Component({
    components:{
      PinCode
    }
  })
  export default class ChangePinCode extends Vue {
    @State('login') login!: LoginState;
    @Action('setPincode', {namespace: 'login'}) setPincode: any;
    password: number | null = null;
    length: number = 4;

    @Watch('password')
    onChildChanged(val: number | null) {
      if(val && val.toString().length === this.length){
        this.setPincode({pinCode: val})
        this.$router.push({'name': 'ConfirmNewPinCode'});
      }
    }
  }
</script>

<style lang="scss">
  #change-pincode{
    .progress-bar{
      .progress{
        width:66%;
      }
    }
    .reset{
      color:#fff;
      opacity:0.5;
    }
  }
</style>