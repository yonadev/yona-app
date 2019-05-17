<template>
  <div id="bottom-menu">
    <div class="columns is-mobile">
      <div class="column">
        <router-link :to="{name: 'Me'}">
          <img :src="require('../assets/images/menu/icn_me'+ (active_page === 'profile' ? '_active' : '' ) +'.svg')">
        </router-link>
      </div>
      <div class="column">
        <router-link :to="{name: 'TimeLine'}">
          <img :src="require('../assets/images/menu/icn_friends'+ (active_page === 'friends' ? '_active' : '' ) +'.svg')">
        </router-link>
      </div>
      <div class="column">
        <router-link :to="{name: 'ChallengesTabs'}">
          <img :src="require('../assets/images/menu/icn_challenge'+ (active_page === 'challenges' ? '_active' : '' ) +'.svg')">
        </router-link>
      </div>
      <div class="column">
        <router-link :to="{name: 'Settings'}">
          <img :src="require('../assets/images/menu/icn_settings'+ (active_page === 'settings' ? '_active' : '' ) +'.svg')">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'

  @Component({})
  export default class BottomMenu extends Vue {
    @Prop() active_page: string;
  }
</script>

<style lang="scss">
  @import "../sass/variables";

  #bottom-menu{
    position:fixed;
    height:50px;
    background-color:#FFF;
    bottom:0;
    width:100%;
    z-index: 4;
    border-top:1px solid #d5d5d5;
    .columns{
      margin:0;
      height:100%;
    }
  }
</style>