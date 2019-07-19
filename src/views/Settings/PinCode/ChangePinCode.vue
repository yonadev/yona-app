<template>
  <div id="change-pincode" class="colored-background yellow pincode-template">
    <div class="nav-title">
      {{$t('changepin')}}
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../../assets/images/signup/account/icn_account_created.svg"/>
      <p class="icon-title">
        {{wrong_pincode === 'true' ? $t('passcodestep1retrytitle') : $t('settings_new_pincode')}}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{wrong_pincode === 'true' ? $t('passcodestep1retrydesc') : $t('settings_new_pin_message')}}
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Watch, Component, Prop} from 'vue-property-decorator'
  import PinCode from '../../../components/PinCode.vue';

  @Component({
    components:{
      PinCode
    }
  })
  export default class ChangePinCode extends Vue {
    @Prop() wrong_pincode!: any;
    password: number | null = null;
    length: number = 4;

    @Watch('password')
    onChildChanged(val: string | null) {
      if(val && val.toString().length === this.length){
        this.$router.push({name: 'ConfirmNewPinCode', params: {pincode: val}});
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