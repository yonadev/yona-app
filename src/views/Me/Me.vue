<template>
  <div id="me" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        <router-link :to="{name: 'Profile'}">
          <img class="small-profile-img" :src="profilePic" /> DASHBOARD
        </router-link>
      </div>
      <div class="tabs is-fullwidth">
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
  import {State} from "vuex-class";
  import {AccountState} from "../../store/account/types";

  @Component({})
  export default class Me extends Vue {
    @State('account') account!: AccountState;
    active_tab: string = 'per_day';
    profilePic: string | null = '';

    mounted () {
      this.profilePic = this.account.userphoto;
    }
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