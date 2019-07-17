<template>
  <div>
    <div v-for="(week_activities, index) in all_week_activities" :key="'week'+index">
        <week-score-label :week_activities="week_activities"></week-score-label>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import {State} from "vuex-class";
  import {ApiState} from "@/store/api/types";
  import axios from "@/utils/axios/axios"
  import WeekScoreLabel from "@/components/WeekScore/WeekScoreLabel.vue";

  @Component({
    components: {
      WeekScoreLabel
    }
  })
  export default class MeTimeLineWeek extends Vue {
    @State('api') api!: ApiState;
    all_week_activities: [{}] = [{}];

    async mounted () {
      if(this.api.links) {
        let weekly_response = await axios.get(this.api.links['yona:weeklyActivityReports'].href);

        if (weekly_response.status == 200)
          this.all_week_activities = weekly_response.data._embedded['yona:weekActivityOverviews'];
      }
    }
  }
</script>

<style lang="scss">
</style>