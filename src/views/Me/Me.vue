<template>
  <div id="me" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        <router-link :to="{name: 'Profile'}">
          <img class="small-profile-img" :src="require('../../assets/images/users/' + profilePic )" /> DASHBOARD
        </router-link>
      </div>
      <div v-if="!edit" class="tabs is-fullwidth">
        <ul>
          <li :class="{'is-active': active_tab === 'per_day'}">
            <a @click.prevent="active_tab = 'per_day'">Per dag</a>
          </li>
          <li :class="{'is-active': active_tab === 'per_week'}">
            <a @click.prevent="active_tab = 'per_week'">Per week</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'per_day'">
      Per dag
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'per_week'">
      Per week
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';

  @Component({})
  export default class Me extends Vue {
    profilePic: string = 'maria1.jpg';
    active_tab: string = 'per_day';
  }
</script>

<style lang="scss">
  #me{
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