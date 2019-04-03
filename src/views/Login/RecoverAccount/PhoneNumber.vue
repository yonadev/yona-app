<template>
  <div id="add-device" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        OPNIEUW REGISTREREN
      </div>
      <div class="header-icon">
        <img src="../../../assets/images/signup/account/icn_avatar.svg"/>
      </div>
    </div>
    <div class="input-fields">
      <p class="disclaimer">
        Wanneer je je telefoon bent kwijtgeraakt en Yona niet op een andere apparaat hebt aangemeld, kan je hier opnieuw registreren. Let op: al je gegevens gaan verloren.
      </p>

      <input-floating-label id="mobile" label="MOBIEL TELEFOONNUMMER" v-model="mobile" type="number" icon="icn_mobile.svg"></input-floating-label>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'RecoverSms'}">INLOGGEN</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import InputFloatingLabel from '../../../components/InputFloatingLabel.vue';

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class PhoneNumber extends Vue {
    private mobile: string = '';
    private passcode: string = '';
  }
</script>

<style lang="scss">
  #add-device{
    .bottom-aligned{
      .button{
        width:100%;
        border:0;
      }
    }
  }
</style>