<template>
    <div>
      <div class="columns is-mobile top-labels">
        <div class="column has-text-left">
          <strong>{{activityCategory.name}}</strong>
        </div>
        <div class="column is-2 current-minutes">
          {{goal.maxDurationMinutes - dayActivity.totalActivityDurationMinutes}}
        </div>
        <div class="column has-text-right">
          <span class="minutes-budget">minuten tegoed</span>
        </div>
      </div>
      <bucket
        :goal="goal.maxDurationMinutes"
        :spend="170">
      </bucket>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    // @ts-ignore
    import Bucket from "./Charts/bucket"
    import {Prop, Component} from 'vue-property-decorator'
    import {ActivityCategory, BudgetGoal} from "@/store/challenges/types";

    @Component({
      components: {
        Bucket
      }
    })
    export default class TimeBucketControl extends Vue {
        @Prop() goal!: BudgetGoal;
        @Prop() activityCategory!: ActivityCategory;
        @Prop() dayActivity! : {
            totalActivityDurationMinutes: number
        };
    }
</script>

<style scoped>

</style>