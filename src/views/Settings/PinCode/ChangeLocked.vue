<template>
  <div id="change-locked" class="colored-background yellow pincode-template">
    <div class="nav-title">
      WIJZIG PINCODE
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Je account is geblokkeerd
      </p>

      <p class="icon-text">
        Om veiligheidsredenen is je account geblokkeerd. Gebruik de ‘PIN reset’ knop hieronder om je account opnieuw te activeren.
      </p>
      <router-link :to="{name: 'ChangeWaitLocked'}" class="button is-white is-rounded">PIN RESET</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component({})
  export default class Locked extends Vue {}
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