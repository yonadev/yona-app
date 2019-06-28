<template>
  <div id="me" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        <router-link :to="{name: 'Profile'}">
          <img v-if="profilePic" class="small-top-icon profile-img" :src="profilePic" />
          <div v-else class="small-top-icon profile-img">
            <span class="text">{{this.account.firstname.charAt(0)}}{{this.account.lastname.charAt(0)}}</span>
          </div> DASHBOARD
        </router-link>
        <router-link class="" :to="{name: 'Notifications'}">
          <img class="small-top-icon is-pulled-right" src="@/assets/images/icons/icn_notification.svg" />
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
      <div v-for="(day_activities, index) in all_day_activities" :key="'day'+index">
        <ui-controls-label :day_activities="day_activities"></ui-controls-label>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'per_week'">
      <div v-for="(week_activities, index) in all_week_activities" :key="'week'+index">
        <week-score-label :week_activities="week_activities"></week-score-label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import {State} from "vuex-class";
  import {AccountState} from "@/store/account/types";
  import {ApiState} from "@/store/api/types";
  import axios from "@/utils/axios/axios"
  import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";
  import WeekScoreLabel from "@/components/WeekScore/WeekScoreLabel.vue";

  @Component({
    components: {
      UiControlsLabel,
      WeekScoreLabel
    }
  })
  export default class Me extends Vue {
    @State('account') account!: AccountState;
    @State('api') api!: ApiState;
    active_tab: string = 'per_day';
    profilePic: string | null = '';
    all_day_activities: [{}] = [{}];
    all_week_activities: {} = {};

    async mounted () {
      this.profilePic = this.account.userphoto;

      if(this.api.links) {
        let [
          daily_response,
          weekly_response
        ] = await Promise.all([
          axios.get(this.api.links['yona:dailyActivityReports'].href),
          axios.get(this.api.links['yona:weeklyActivityReports'].href)
        ]);

        if (daily_response.status == 200)
          this.all_day_activities = daily_response.data._embedded['yona:dayActivityOverviews'];

        if (weekly_response.status == 200)
          this.all_week_activities = weekly_response.data._embedded['yona:weekActivityOverviews'];
      }
    }
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
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
      }
    }
  }
</style>