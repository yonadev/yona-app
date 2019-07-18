<template>
  <div>
    <div v-for="(week_activities, index) in weeklyActivityReports" :key="'week'+index">
        <week-score-label :week_activities="week_activities" :buddy_href="buddy_href"></week-score-label>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import {Getter, State} from "vuex-class";
  import {ApiState} from "@/store/api/types";
  import axios from "@/utils/axios/axios"
  import WeekScoreLabel from "@/components/WeekScore/WeekScoreLabel.vue";
  import {Prop} from "vue-property-decorator";
  import {Buddy} from "@/store/buddies/types";

  @Component({
    components: {
      WeekScoreLabel
    }
  })
  export default class FriendsTimeLineWeek extends Vue {
    @Prop() buddy_href!: string;

    @Getter('buddy', {namespace: 'buddies'})
    public buddy!: (buddy_href: string) => Buddy;

    get buddyProfile(){
      return this.buddy(this.buddy_href);
    }

    weeklyActivityReports: [{}] = [{}];

    async mounted () {
      let weekly_response = await axios.get(this.buddyProfile._links['yona:weeklyActivityReports'].href);

        if (weekly_response.status == 200)
            this.weeklyActivityReports = weekly_response.data._embedded['yona:weekActivityOverviews'];
    }
  }
</script>

<style lang="scss">
</style>