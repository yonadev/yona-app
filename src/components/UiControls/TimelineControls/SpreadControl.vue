<template>
    <div>
      <bars
        :max="15"
        :goal="[...(goal.spreadCells ? goal.spreadCells : [])]"
        :data="dayActivity.spread">
      </bars>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Prop, Component} from 'vue-property-decorator'
    import {TimeZoneGoal} from "@/store/challenges/types";
    //@ts-ignore
    import Bars from "../Charts/bars"

    @Component({
      components: {
        Bars
      }
    })
    export default class SpreadControl extends Vue {
        @Prop() goal!: TimeZoneGoal;
        @Prop() title!: string;
        @Prop() dayActivity! : {
            totalActivityDurationMinutes: number,
            totalMinutesBeyondGoal: number
        };
    }
</script>

<style>

</style>