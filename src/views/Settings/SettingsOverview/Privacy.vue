<template>
  <div id="privacy" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("privacy") }}
      </div>
    </div>
    <iframe
      width="100%"
      height="100%"
      src="https://www.yona.nu/app/privacy"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Privacy extends Vue {}
</script>

<style lang="scss">
#privacy {
  iframe {
    width: 100%;
    height: calc(100% - 50px - 77px);
  }
}
</style>
