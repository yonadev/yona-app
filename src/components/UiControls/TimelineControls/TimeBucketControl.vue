<template>
  <div>
    <bucket
      :goal="goal.maxDurationMinutes"
      :spend="dayActivity.totalActivityDurationMinutes"
    >
    </bucket>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// @ts-ignore
import Bucket from "../Charts/bucket";
import { Prop, Component } from "vue-property-decorator";
import { BudgetGoal } from "@/store/challenges/types";

@Component({
  components: {
    Bucket
  }
})
export default class TimeBucketControl extends Vue {
  @Prop() goal!: BudgetGoal;
  @Prop() title!: string;
  @Prop() dayActivity!: {
    totalActivityDurationMinutes: number;
  };
}
</script>

<style scoped></style>
