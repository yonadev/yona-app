<template>
  <div id="pincode" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      OPNIEUW REGISTREREN
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/add_avatar.svg"/>
      <p class="icon-title">
        Account wordt aangemaakt
      </p>
      <div class="progress-bar">
        <div class="progress" style="width:33%;"></div>
      </div>
      <p class="icon-text">
        Als extra beveiliging ontvang je een code per SMS, graag deze code hieronder invullen.
      </p>
      <pin-code v-model="password" :length="length"></pin-code>
      <router-link :to="{'name': ''}">
        <p class="reset">
          Stuur code opnieuw
        </p>
      </router-link>
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
  export default class RecoverSms extends Vue {
    private password: number = 0;
    private length: number = 4;

    @Watch('password')
    onChildChanged(val: number, oldVal: number) {
      if(val.toString().length === this.length){
        this.$router.push({'name': 'SetPinCode'});
      }
    }
  }
</script>

<style lang="scss"></style>