<template>
  <div id="names" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        DOE MEE
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <input-floating-label id="firstname" label="VOORNAAM" v-model="firstname" type="text" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="lastname" label="ACHTERNAAM" v-model="lastname" type="text" icon="icn_name.svg"></input-floating-label>

      <p class="disclaimer">
        Yona respecteert en beschermt je privacy. Alle gevoelige informatie is beveiligd met encryptie.
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Choose'}">VORIGE</router-link>
      <router-link class="button" :to="{name: 'AccountInfo'}">VOLGENDE</router-link>
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
export default class Names extends Vue {
  private firstname: string = '';
  private lastname: string = '';
}
</script>

<style lang="scss"></style>