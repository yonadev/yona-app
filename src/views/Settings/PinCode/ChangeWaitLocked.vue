<template>
  <div id="change-locked" class="colored-background yellow pincode-template">
    <div class="nav-title">
      {{$t('changepin')}}
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        {{$t('timer_wait_title')}}
      </p>
      <p class="icon-text">
        <!-- TODO: Voeg variabele toe voor wachttijd -->
        {{$t('timer_wait_desc')}}
      </p>
      <!-- TODO: Maak timer werkend -->
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