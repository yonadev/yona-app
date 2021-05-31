<template>
  <div class="week-score-label">
    <div class="top-label">
      <strong v-if="week_activities.date">{{
        getWeekLabel(week_activities.date)
      }}</strong>
    </div>
    <div
      v-for="(week_activity, index) in week_activities.weekActivities"
      :key="'weekactivity' + index"
    >
      <router-link
        :to="{
          name: buddy_href ? 'FriendsDetailedViewWeek' : 'DetailedViewWeek',
          params: {
            buddy_href,
            activity_link: week_activity._links['yona:weekDetails'].href,
          },
        }"
      >
        <week-score
          :week_activity="week_activity"
          :week_number="week_activities.date"
          :buddy_href="buddy_href"
        ></week-score>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import WeekScore from "./WeekScore.vue";
import moment from "moment";

@Component({
  components: {
    WeekScore,
  },
})
export default class UiControlsLabel extends Vue {
  @Prop() week_activities!: string;
  @Prop({
    default: "",
  })
  buddy_href!: string;

  getWeekLabel(date: any) {
    let now = moment(new Date()).weekday(0).week();
    let week = moment(date, moment.ISO_8601).weekday(0).week();

    if (now === week) return this.$t("this_week");
    else if (now - 1 === week) return this.$t("last_week");
    else
      return (
        moment(date, moment.ISO_8601).isoWeekday(0).format("D MMMM") +
        " - " +
        moment(date, moment.ISO_8601).isoWeekday(6).format("D MMMM")
      );
  }
}
</script>

<style lang="scss">
.week-score-label {
  min-height: 100px;
  .top-label {
    text-transform: uppercase;
    background: #e7e7e7;
    padding: 17px;
    font-size: 0.9rem;
    opacity: 0.6;
    border-bottom: 1px solid #d5d5d5;
    border-top: 1px solid #d5d5d5;
  }
}
</style>
