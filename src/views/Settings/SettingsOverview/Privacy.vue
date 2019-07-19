<template>
  <div id="privacy" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{$t('privacy')}}
      </div>
    </div>
    <!-- TODO: Add content from web -->
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'

  @Component({
  })
  export default class ChangePinCode extends Vue {}
</script>

<style lang="scss">
  #privacy{
  }
</style>