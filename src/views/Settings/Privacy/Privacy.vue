<template>
  <span>
    <div id="privacy" class="header-template">
      <div class="colored-background yellow">
        <div class="nav-title">
          PRIVACY
        </div>
      </div>
    </div>
    <bottom-menu active_page="settings"></bottom-menu>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import BottomMenu from "../../../components/BottomMenu";

  @Component({
    components: {BottomMenu}
  })
  export default class ChangePinCode extends Vue {}
</script>

<style lang="scss">
  #privacy{
  }
</style>