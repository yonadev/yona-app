<template>
  <div class="ui-controls">
    <div class="top-label">
      <strong>{{getDayLabel(day_activities.date)}}</strong>
    </div>
    <div v-for="(day_activity, index) in day_activities.dayActivities" :key="'activity'+index">
      <ui-control :day_activity="day_activity" type="simple"></ui-control>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import UiControl from "./UiControl.vue";

  @Component({
    components: {
      UiControl
    }
  })
  export default class UiControlsLabel extends Vue {
    @Prop() day_activities!: string;

    getDayLabel(date: any){
      let now = new Date()
      let date_obj = new Date(date)
      let days = ["ZONDAG", "MAANDAG", "DINSDAG", "WOENSDAG", "DONDERDAG", "VRIJDAG", "ZATERDAG"];
      let months = ["JANUARI", "FEBRUARI", "MAART", "APRIL", "MEI", "JUNI", "JULI", "AUGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DECEMBER"];

      if(now.getDate() === date_obj.getDate())
        date = 'VANDAAG';
      else if((now.getDate()-1) === date_obj.getDate())
        date = 'GISTEREN'
      else
        date = days[date_obj.getDay()]+', '+date_obj.getDate()+' '+months[date_obj.getMonth()]

      return date
    }
  }
</script>

<style lang="scss">
  .ui-controls{
    min-height:50px;
    .top-label{
      background:#e7e7e7;
      padding: 17px;
      font-size: 11px;
      opacity: 0.6;
      border-bottom:1px solid #d5d5d5;
      border-top:1px solid #d5d5d5;
    }
  }
</style>