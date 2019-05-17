<template>
  <div id="change-locked" class="colored-background yellow pincode-template">
    <div class="nav-title">
      WIJZIG PINCODE
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Je moet even wachten
      </p>
      <p class="icon-text">
        Om veiligheidsredenen is je account geblokkeerd. Activeren kan 24 uur nadat je een nieuwe PIN code hebt aangevraagd.
      </p>
      <timer time="April 5, 2024"></timer>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import Timer from '../../../components/Timer.vue';

  @Component({
    components:{
      Timer
    }
  })
  export default class WaitLocked extends Vue {}
</script>

<style lang="scss">
  #change-locked{
    .button{
      box-sizing: border-box;
      margin-top:5px;
      padding:10px;
      height:auto;
      width:100%;
    }
  }
</style>