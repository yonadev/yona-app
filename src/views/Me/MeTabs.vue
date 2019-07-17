<template>
  <div id="me" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title is-vcentered columns is-mobile">
        <router-link tag="div" :to="{name: 'Profile'}" class="column is-8">
          <profile-pic src="user_image"></profile-pic>
          <span class="dashboard-title">DASHBOARD</span>
        </router-link>
        <router-link tag="div" :to="{name: 'Notifications'}" class="column">
          <img class="small-top-icon is-pulled-right" src="@/assets/images/icons/icn_notification.svg" />
        </router-link>
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <router-link tag="li" :to="{name: 'MeTimeLineDay'}" active-class="is-active">
            <a>Per dag</a>
          </router-link>
          <router-link tag="li" :to="{name: 'MeTimeLineWeek'}" active-class="is-active">
            <a>Per week</a>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import {State} from "vuex-class";
    import {AccountState} from "@/store/account/types";
    import Component from "vue-class-component";
    import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

    @Component({
      components: {ProfilePic}
    })
    export default class MeTabs extends Vue {
        @State('account') account!: AccountState;
    }
</script>

<style lang="scss">
  #me{
    .small-top-icon{
      vertical-align: middle;
      top: -2px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      position: relative;
      &.profile-img {
        width: 30px;
        height: 30px;
        background-color: #915C80;
        margin-right: 20px;
        display: inline-block;
        .text{
          padding:5px;
          position: relative;
          display: block;
        }
      }
    }
    .dashboard-title{
      display:inline-block;
      vertical-align: top;
      height:35px;
      line-height:35px;
      margin-left: 10px;
    }
    .nav-title{
      padding:30px 15px 10px 15px;
      img{
        width:35px;
      }
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
      }
    }
  }
</style>