<template>
  <div id="add-device" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        DEVICE TOEVOEGEN
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/icn_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <p class="disclaimer">
        Je hebt nog niet eerder ingelogd op dit apparaat. Ga naar je primaire device (waarschijnlijk je mobiel), open Yona, vervolgens naar instellingen en klik op ‘apparaat toevoegen’. Vul vervolgens onderstaande velden in.
      </p>

      <input-floating-label id="mobile" label="MOBIEL TELEFOONNUMMER" v-model="mobile" type="number" icon="icn_mobile.svg"></input-floating-label>
      <input-floating-label id="passcode" label="PASSCODE" v-model="passcode" type="text" icon="icn_name.svg"></input-floating-label>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'SetPinCode'}">INLOGGEN</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import InputFloatingLabel from '../../components/InputFloatingLabel.vue';

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class AddDevice extends Vue {
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