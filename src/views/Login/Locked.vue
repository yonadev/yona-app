<template>
  <div id="locked" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{$t('login')}}
    </div>
    <div class="wrapper">
      <img src="../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        {{$t('msgblocktitle')}}
      </p>

      <p class="icon-text">
        {{$t('msgblockuser')}}
      </p>
      <span class="button is-white is-rounded" @click="pinReset">{{$t('passcodereset')}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import {Action} from "vuex-class";

  @Component({})
  export default class Locked extends Vue {
    @Action('pinReset', {namespace: 'login'}) pinReset: any;
  }
</script>

<style lang="scss">
  #locked{
    .button{
      box-sizing: border-box;
      margin-top:5px;
      padding:10px;
      height:auto;
      width:100%;
    }
  }
</style>