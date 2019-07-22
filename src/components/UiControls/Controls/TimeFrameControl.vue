<template>
  <div>
    <div class="columns is-mobile top-labels">
      <div class="column has-text-left">
        <strong>{{ title }}</strong>
      </div>
      <div
        class="column is-2 current-minutes"
        :class="{ warning: dayActivity.totalMinutesBeyondGoal > 0 }"
      >
        {{ dayActivity.totalMinutesBeyondGoal }}
      </div>
      <div class="column has-text-right">
        <span class="minutes-budget">{{ $t("goaloverminute") }}</span>
      </div>
    </div>
    <!--<bars
        :data="dayActivity.spread">
      </bars>-->
    <columns :max="15" :goal="goal.spreadCells" :data="dayActivity.spread">
    </columns>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// @ts-ignore
import Columns from "../Charts/columns";
import { Prop, Component } from "vue-property-decorator";
import { ActivityCategory, TimeZoneGoal } from "@/store/challenges/types";

@Component({
  components: {
    Columns
  }
})
export default class TimeFrameControl extends Vue {
  @Prop() goal!: TimeZoneGoal;
  @Prop() title!: string;
  @Prop() dayActivity!: {
    totalActivityDurationMinutes: number;
    totalMinutesBeyondGoal: number;
  };
}
</script>
