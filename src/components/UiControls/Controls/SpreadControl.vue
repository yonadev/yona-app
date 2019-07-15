<template>
    <div>
      <div class="columns is-mobile top-labels">
        <div class="column has-text-left">
          <strong>{{activityCategory.name}}</strong>
        </div>
        <div class="column is-2 current-minutes">
          {{dayActivity.totalMinutesBeyondGoal}}
        </div>
        <div class="column has-text-right">
          <span class="minutes-budget">minuten buiten tijd</span>
        </div>
      </div>
      <div class="bar">
      </div>
      <div class="columns is-mobile">
        <div class="column has-text-left">0</div>
        <div class="column has-text-right">{{goal.maxDurationMinutes}}</div>
      </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Prop, Component} from 'vue-property-decorator'
    import {ActivityCategory, TimeZoneGoal} from "@/store/challenges/types";

    @Component({
    })
    export default class SpreadControl extends Vue {
        @Prop() goal!: TimeZoneGoal;
        @Prop() activityCategory!: ActivityCategory;
        @Prop() dayActivity! : {
            totalActivityDurationMinutes: number,
            totalMinutesBeyondGoal: number
        };
    }
</script>

<style>

</style>