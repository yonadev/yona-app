<template>
  <div id="account-info" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        DOE MEE
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <input-floating-label id="mobile" label="MOBIEL TELEFOONNUMMER" type="number" v-model="mobile" icon="icn_mobile.svg"></input-floating-label>
      <input-floating-label id="nickname" label="NICK NAME" type="text" v-model="nickname" icon="icn_nickname.svg"></input-floating-label>

      <p class="disclaimer">
        We gebruiken je mobile nummer voor een veilige registratie. Je nickname is verplicht en zorgt voor een nog betere privacy.
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Names'}">VORIGE</router-link>
      <span class="button" @click="checkTelNumber">VOLGENDE</span>
    </div>

    <div class="is-centered" v-if="choose">
      <router-link class="button" :to="{name: 'AddDevice'}">Apparaat toevoegen</router-link>
      <router-link class="button" :to="{name: 'PhoneNumber'}">Opnieuw registreren</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import InputFloatingLabel from '../../components/InputFloatingLabel.vue';

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class AccountInfo extends Vue {
    private mobile: string = '';
    private nickname: string = '';
    private choose: boolean = false;

    checkTelNumber () {
      if(this.mobile === '1111'){
        this.choose = true;
      } else {
        this.$router.push({'name': 'SmsValidation'});
      }
    }
  }
</script>

<style lang="scss"></style>