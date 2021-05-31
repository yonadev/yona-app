<template>
  <div>
    <columns :max="15" :goal="goal.spreadCells" :data="dayActivity.spread">
    </columns>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// @ts-ignore
import Columns from "../Charts/columns";
import { Prop, Component } from "vue-property-decorator";
import { TimeZoneGoal } from "@/store/challenges/types";

@Component({
  components: {
    Columns,
  },
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
