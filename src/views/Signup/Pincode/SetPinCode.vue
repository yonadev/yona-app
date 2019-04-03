<template>
  <div id="pincode" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      PINCODE
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../../assets/images/signup/account/icn_account_created.svg"/>
      <p class="icon-title">
        Account is aangemaakt
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Voor een goede beveiliging is het verplicht om de Yona app te voorzien van een pincode.
        Stel je pincode hieronder in.
      </p>
      <pin-code v-model="password" :length="length"></pin-code>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Watch, Component } from 'vue-property-decorator'
  import PinCode from '../../../components/PinCode.vue';

  @Component({
    components:{
      PinCode
    }
  })
  export default class SetPinCode extends Vue {
    private password: number = 0;
    private length: number = 4;

    @Watch('password')
    onChildChanged(val: number) {
      if(val.toString().length === this.length){
        this.$router.push({'name': 'ConfirmPinCode'});
      }
    }
  }
</script>

<style lang="scss">
  #pincode{
    .progress-bar{
      .progress{
        width:66%;
      }
    }
  }
</style>