<template>
  <div class="timeline-control">
    <div class="columns is-mobile is-vcentered">
      <div class="column is-2">
        <div v-if="goal && goal['@type'] === 'BudgetGoal' && this.goal.maxDurationMinutes === 0">
          <img v-if="day_activity.goalAccomplished" :src="require('../../assets/images/avatars/adult_happy.svg')" />
          <img v-else :src="require('../../assets/images/avatars/adult_sad.svg')" />
        </div>
        <div v-else>
          <img :src="user_image"/>
        </div>
      </div>
      <div class="column">
        <div v-if="goal && goal['@type'] === 'BudgetGoal' && this.goal.maxDurationMinutes === 0">
          <no-go-control :username="username" :goal="goal" :dayActivity="day_activity"></no-go-control>
        </div>
        <div v-else-if="goal && goal['@type'] === 'BudgetGoal'">
          <time-bucket-control :goal="goal" :dayActivity="day_activity"></time-bucket-control>
        </div>
        <div v-else-if="goal">
          <time-frame-control :goal="goal" :dayActivity="day_activity"></time-frame-control>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import { Goal} from "@/store/challenges/types";
  import NoGoControl from "./TimelineControls/NoGoControl.vue";
  import SpreadControl from "./TimelineControls/SpreadControl.vue";
  import TimeBucketControl from "./TimelineControls/TimeBucketControl.vue";
  import TimeFrameControl from "./TimelineControls/TimeFrameControl.vue";

  @Component({
    components: {
      NoGoControl,
      SpreadControl,
      TimeBucketControl,
      TimeFrameControl
    }
  })
  export default class TimelineControl extends Vue {
    @Prop() user_image!: string;
    @Prop() username!: string;
    @Prop() goal!: Goal;
    @Prop() day_activity!: {
      goalAccomplished: boolean,
      totalActivityDurationMinutes: number,
      totalMinutesBeyondGoal: number,
      _links: {
        [key: string]:{
          href: string
        }
      }
    };
  }
</script>

<style lang="scss">
  @import "../../sass/variables";
  .timeline-control{
    img{
      width:35px;
      height:35px;
    }
  }
</style>