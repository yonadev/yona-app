<template>
  <div class="timeline-control">
    <div class="columns is-mobile is-vcentered">
      <div class="column is-2">
        <div
          v-if="
            goal &&
            goal['@type'] === 'BudgetGoal' &&
            this.goal.maxDurationMinutes === 0
          "
        >
          <img
            v-if="day_activity.goalAccomplished"
            :src="require('../../assets/images/avatars/adult_happy.svg')"
          />
          <img
            v-else
            :src="require('../../assets/images/avatars/adult_sad.svg')"
          />
        </div>
        <div v-else>
          <profile-pic :src="user_image"></profile-pic>
        </div>
      </div>
      <div class="column">
        <no-go-control
          v-if="
            goal &&
            goal['@type'] === 'BudgetGoal' &&
            this.goal.maxDurationMinutes === 0
          "
          :username="username"
          :goal="goal"
          :dayActivity="day_activity"
        ></no-go-control>

        <time-bucket-control
          v-else-if="goal && goal['@type'] === 'BudgetGoal'"
          :goal="goal"
          :dayActivity="day_activity"
        ></time-bucket-control>

        <time-frame-control
          v-else-if="goal"
          :goal="goal"
          :dayActivity="day_activity"
        ></time-frame-control>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Goal } from "@/store/challenges/types";
import NoGoControl from "./TimelineControls/NoGoControl.vue";
import SpreadControl from "./TimelineControls/SpreadControl.vue";
import TimeBucketControl from "./TimelineControls/TimeBucketControl.vue";
import TimeFrameControl from "./TimelineControls/TimeFrameControl.vue";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

@Component({
  components: {
    ProfilePic,
    NoGoControl,
    SpreadControl,
    TimeBucketControl,
    TimeFrameControl,
  },
})
export default class TimelineControl extends Vue {
  @Prop() user_image!: string;
  @Prop() username!: string;
  @Prop() goal!: Goal;
  @Prop() day_activity!: {
    goalAccomplished: boolean;
    totalActivityDurationMinutes: number;
    totalMinutesBeyondGoal: number;
    _links: {
      [key: string]: {
        href: string;
      };
    };
  };
}
</script>

<style lang="scss">
@import "../../sass/variables";
.timeline-control {
  img {
    width: 2.9rem;
    height: 2.9rem;
  }
}
</style>
