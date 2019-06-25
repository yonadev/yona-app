<template>
  <div id="me" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        <router-link :to="{name: 'Profile'}">
          <img class="small-top-icon profile-img" :src="profilePic" /> DASHBOARD
        </router-link>
        <router-link class="" :to="{name: 'Notifications'}">
          <img class="small-top-icon is-pulled-right" src="../../assets/images/icons/icn_notification.svg" />
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
  import {LinksState} from "@/store/links/types";
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
    @State('links') links!: LinksState;
    active_tab: string = 'per_day';
    profilePic: string | null = '';
    all_day_activities: [{}] = [{}];
    all_week_activities: {} = {};

    async mounted () {
      this.profilePic = this.account.userphoto;

      if(this.links.links) {
        let [
          daily_response,
          weekly_response
        ] = await Promise.all([
          axios.get(this.links.links['yona:dailyActivityReports'].href),
          axios.get(this.links.links['yona:weeklyActivityReports'].href)
        ]);

        if (daily_response.status == 200)
          this.all_day_activities = daily_response.data._embedded['yona:dayActivityOverviews']

        if (weekly_response.status == 200)
          this.all_week_activities = weekly_response.data._embedded['yona:weekActivityOverviews']
      }
    }
  }
</script>

<style lang="scss">
  #me{
    .small-top-icon{
      vertical-align: middle;
      top: -2px;
      width:25px;
      height:25px;
      border-radius: 50%;
      position:relative;
      &.profile-img {
        width:30px;
        height:30px;
        background-color:#000;
        margin-right: 20px;
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
      .top-label{
        background:#e7e7e7;
        padding: 17px;
        font-size: 11px;
        opacity: 0.6;
        border-bottom:1px solid #d5d5d5;
        border-top:1px solid #d5d5d5;
      }
    }
  }
</style>