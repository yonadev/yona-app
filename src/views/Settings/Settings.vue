<template>
  <span>
    <div id="settings" class="header-template">
      <div class="colored-background yellow">
        <div class="nav-title">
          SETTINGS
        </div>
      </div>
      <div class="wrapper">
        <router-link :to="{name: 'CheckPinCode'}">
          <div class="grey-bg-button">
            <strong>Wijzig pincode</strong>
          </div>
        </router-link>
        <router-link :to="{name: 'Privacy'}">
          <div class="grey-bg-button">
            <strong>Privacy</strong>
          </div>
        </router-link>
        <router-link :to="{name: 'SettingsAddDevice'}">
          <div class="grey-bg-button">
            <strong>Device toevoegen</strong>
          </div>
        </router-link>
        <router-link :to="{name: 'Unsubscribe'}">
          <div class="grey-bg-button">
            <strong>Unsubscribe</strong>
          </div>
        </router-link>
      </div>
    </div>
    <bottom-menu active_page="settings"></bottom-menu>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import BottomMenu from "../../components/BottomMenu";

  @Component({
    components: {BottomMenu}
  })
  export default class Settings extends Vue {}
</script>

<style lang="scss">
  #settings{
    .nav-title{
      padding: 30px 15px 15px 30px;
    }
    .wrapper{
      padding:0;
      .grey-bg-button{
        background-image: linear-gradient(#f7f7f7, #fcfcfc);
        padding:20px 25px 20px 25px;
        text-align: left;
      }
    }
  }
</style>