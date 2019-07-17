<template>
  <div class="timeline-control">
    <div class="columns is-mobile">
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
    background: #f7f7f7; /* Old browsers */
    background: -moz-linear-gradient(top, #f7f7f7 0%, #fcfcfc 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #f7f7f7 0%,#fcfcfc 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #f7f7f7 0%,#fcfcfc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#fcfcfc',GradientType=0 ); /* IE6-9 */
    .top-labels{
      display:flex;
      align-items: center;
      margin-bottom: 0 !important;
      margin-top: 0 !important;


      > .column {
        padding: 1.5rem .75rem;
        line-height: 1 !important;
      }

      .current-minutes{
        font-family: Oswald, sans-serif;
        font-size:28px;

        &.warning {
          color: $color-purple;
        }

      }
      .minutes-budget{
        font-size:10px;
        opacity:0.6;
      }
    }

    img{
      width:35px;
      height:35px;
    }

    svg {
      margin-bottom: 1.5rem;
    }

    .bar{
      height:25px;
      width:100%;
      background-color:#e7e7e7;
      margin-bottom:10px;
      .filler{
        height:100%;
        background-color: $color-green;
      }
    }
  }
</style>