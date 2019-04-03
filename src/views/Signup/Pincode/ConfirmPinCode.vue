<template>
  <div id="pincode" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      PINCODE
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Bevestig pincode
      </p>
      <div class="progress-bar">
        <div class="progress" style="width:100%;"></div>
      </div>
      <p class="icon-text">
        Vul je pincode nog een keer in ter bevestiging.
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
  export default class ConfirmPinCode extends Vue {
    private password: number = 0;
    private length: number = 4;

    @Watch('password')
    onChildChanged(val: number) {
      if(val.toString().length === this.length){
        this.$router.push({'name': 'Dashboard'});
      }
    }
  }
</script>

<style lang="scss"></style>