<template>
  <div class="columns is-mobile top-labels">
    <div class="column is-4 has-text-left">
      {{username}}
    </div>
    <div class="column has-text-right">
      <span class="minutes-budget">
        <span v-if="dayActivity.totalMinutesBeyondGoal == 0">
          geen hits, hou vol!
        </span>
        <span v-else>
          {{dayActivity.totalMinutesBeyondGoal}} minuten
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import { BudgetGoal} from "@/store/challenges/types";

  @Component({})
  export default class NoGoControl extends Vue {
    @Prop() goal!: BudgetGoal;
    @Prop() username!: string;
    @Prop() dayActivity! : {
        goalAccomplished: boolean,
        totalActivityDurationMinutes: number,
        totalMinutesBeyondGoal: number
    };
  }
</script>

<style>

</style>