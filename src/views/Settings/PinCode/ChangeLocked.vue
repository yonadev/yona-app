<template>
  <div id="change-locked" class="colored-background yellow pincode-template">
    <div class="nav-title">
      {{ $t("changepin") }}
    </div>
    <div class="wrapper">
      <img src="../../../assets/images/signup/account/icn_secure.svg" />
      <p class="icon-title">
        {{ $t("msgblocktitle") }}
      </p>

      <p class="icon-text">
        {{ $t("msgblockuser") }}
      </p>
      <span
        class="button is-white is-rounded"
        @click="pinReset({ view: 'changePin' })"
        >{{ $t("passcodereset") }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({})
export default class Locked extends Vue {
  @Action("pinReset", { namespace: "login" }) pinReset: any;
}
</script>

<style lang="scss">
#change-locked {
  .button {
    box-sizing: border-box;
    margin-top: 5px;
    padding: 10px;
    height: auto;
    width: 100%;
  }
}
</style>
