<template>
  <div id="friends-timeline" class="header-template">
    <div class="colored-background blue">
      <div class="nav-title">
        VRIENDEN
      </div>
      <div v-if="!edit" class="tabs is-fullwidth">
        <ul>
          <li :class="{'is-active': active_tab === 'timeline'}">
            <a @click.prevent="active_tab = 'timeline'">Timeline</a>
          </li>
          <li :class="{'is-active': active_tab === 'overview'}">
            <a @click.prevent="active_tab = 'overview'">Overzicht</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'timeline'">
      Per dag
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'overview'">
      Per week
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';

  @Component({})
  export default class TimeLine extends Vue {
    active_tab: string = 'timeline';
  }
</script>

<style lang="scss">
  #friends-timeline{
    .small-profile-img{
      vertical-align: middle;
      top: -2px;
      width:30px;
      height:30px;
      border-radius: 50%;
      position:relative;
      background-color:#000;
      margin-right: 20px;
    }
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      &.grey-bg{
        background-color:#f3f3f3;
      }
    }
  }
</style>