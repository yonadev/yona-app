<template>
    <div>
      <div class="columns is-mobile top-labels">
        <div class="column has-text-left">
          <strong>{{title}}</strong>
        </div>
        <div class="column is-2 current-minutes">
            <img v-if="dayActivity.goalAccomplished" :src="require('../../../assets/images/avatars/adult_happy.svg')" />
            <img v-else :src="require('../../../assets/images/avatars/adult_sad.svg')" />
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
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Prop, Component} from 'vue-property-decorator'
    import {ActivityCategory, BudgetGoal} from "@/store/challenges/types";

    @Component({
    })
    export default class NoGoControl extends Vue {
        @Prop() goal!: BudgetGoal;
        @Prop() title!: string;
        @Prop() dayActivity! : {
            goalAccomplished: boolean,
            totalActivityDurationMinutes: number,
            totalMinutesBeyondGoal: number
        };
    }
</script>

<style>

</style>