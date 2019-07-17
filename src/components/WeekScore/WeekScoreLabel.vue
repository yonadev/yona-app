<template>
  <div class="week-score-label">
    <div class="top-label">
      <strong>{{getWeekLabel(week_activities.date)}}</strong>
    </div>
    <div v-for="(week_activity, index) in week_activities.weekActivities" :key="'weekactivity'+index">
      <router-link :to="{'name': 'DetailedViewWeek', params: {activity_link: week_activity._links['yona:weekDetails'].href}}">
        <week-score :week_activity="week_activity" :week_number="week_activities.date"></week-score>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import WeekScore from "./WeekScore.vue";
  import moment from 'moment'

  @Component({
    components: {
      WeekScore
    }
  })
  export default class UiControlsLabel extends Vue {
    @Prop() week_activities!: string;

    getWeekLabel(date: any){
      let now = moment(new Date()).weekday(0).week();
      let week = moment(date, moment.ISO_8601).weekday(0).week();

      if(now === week)
        return 'DEZE WEEK';
      else if(now-1 === week)
        return 'VORIGE WEEK';
      else
        return moment(date, moment.ISO_8601).isoWeekday(0).format('D MMMM')+' - '+moment(date, moment.ISO_8601).isoWeekday(6).format('D MMMM')
    }
  }
</script>

<style lang="scss">
  .week-score-label{
    min-height:100px;
    .top-label{
      text-transform: uppercase;
      background:#e7e7e7;
      padding: 17px;
      font-size: 11px;
      opacity: 0.6;
      border-bottom:1px solid #d5d5d5;
      border-top:1px solid #d5d5d5;
    }
  }
</style>