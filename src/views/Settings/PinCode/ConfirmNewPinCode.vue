<template>
  <div id="confirm-new-pincode" class="colored-background yellow pincode-template">
    <div class="nav-title">
      WIJZIG PINCODE
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../../assets/images/signup/account/icn_account_created.svg"/>
      <p class="icon-title">
        Bevestig pincode
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Vul je pincode nogmaals in ter bevestiging.
      </p>
      <p class="icon-text" v-if="error">
        De pincode komt niet overeen!
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
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
  export default class ConfirmPinCode extends Vue {
    @State('login') login!: LoginState;
    private password: number | null = null;
    private length: number = 4;
    private error: boolean = false;

    @Watch('password')
    onChildChanged(val: number | null) {
      if(val && val.toString().length === this.length){
        if(val === this.login.pinCode)
          this.$router.push({'name': 'Settings'});
        else{
          this.error = true;
          this.password = null;
        }
      }
    }
  }
</script>

<style lang="scss">
  #confirm-new-pincode{
    .progress-bar{
      .progress{
        width:100%;
      }
    }
  }
</style>