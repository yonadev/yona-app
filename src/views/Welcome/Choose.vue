<template>
  <div id="choose">
    <img src="../../assets/images/welcome/choose/yona_logo.svg" />

    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Names'}">
        DOE MEE
      </router-link>
      <router-link class="button" :to="{name: 'Login'}">
        INLOGGEN
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({})
export default class Choose extends Vue {}
</script>

<style lang="scss">
  @import "../../sass/variables";
  @import "../../sass/components/bottom-buttons";
  #choose{
    text-align: center;
    img{
      display: block;
      padding-top:30%;
      margin-left: auto;
      margin-right: auto;
      width: 50%;
    }
  }
</style>