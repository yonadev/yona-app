<template>
  <div class="week-score-day">
    <div class="columns is-mobile top-labels">
      <div class="column has-text-left">
        <strong>{{activityCategory.name}}</strong>
      </div>
      <div class="column is-2 current-accomplished">
        {{getAccomplishedCount(week_activity.dayActivities)}}
      </div>
      <div class="column has-text-right">
        <span class="goal-accomplished">x doel gehaald</span>
      </div>
    </div>
    <div class="columns is-mobile is-centered is-1-mobile is-variable week">
      <span class="day column" v-for="(day_of_week, index) in day_of_weeks" :key="'day'+day_of_week"
            :class="{
            'accomplished': week_activity.dayActivities[day_of_week] && week_activity.dayActivities[day_of_week].goalAccomplished,
            'failed': week_activity.dayActivities[day_of_week] && !week_activity.dayActivities[day_of_week].goalAccomplished
          }">
        <span class="date">
          <p>
            {{day_initial_of_week[index]}}<br/>
            {{getDate(index)}}
          </p>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import moment from 'moment'
  import axios from "../../utils/axios/axios"

  @Component({})
  export default class WeekScore extends Vue {
    @Prop() week_activity!: {
      _links: {
        [key: string]:{
          href: string
        }
      }
    };
    @Prop() week_number!: string;
    goal: {
      '@type': string,
      creationTime: string,
      historyItem: boolean,
      maxDurationMinutes: number,
      _links: {
        [key: string]:{
          href: string
        }
      }
    } = {
      '@type': '',
      creationTime: '',
      historyItem: false,
      maxDurationMinutes: 0,
      _links: {}
    };
    activityCategory: {} = {};
    day_of_weeks: [ string, string, string, string, string, string, string] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    day_initial_of_week: [ string, string, string, string, string, string, string] = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

    async mounted(){
      //First get the day activity so we can get the goal
      if (this.week_activity) {
        let goal_response: any = await axios.get(this.week_activity._links['yona:goal'].href).catch((error) => {
          console.log(error)
        });

        if (goal_response.status === 200)
          this.goal = goal_response.data

        //Get the category
        let category_response: any = await axios.get(this.goal._links['yona:activityCategory'].href).catch((error) => {
          console.log(error)
        });

        if(category_response.status === 200)
          this.activityCategory = category_response.data
      }
    }

    getAccomplishedCount(activities: any){
      let count: number = 0;
      Object.keys(activities).forEach((key: string)=>{
        if(activities[key].goalAccomplished)
          count++;
      })
      return count;
    }

    getDate(index: any){
      return moment(this.week_number, moment.ISO_8601).day(index).get('date');
    }
  }
</script>

<style lang="scss">
  @import "../../sass/variables";

  .week-score-day{
    min-height:50px;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#f7f7f7), to(#fcfcfc));
    background-image: linear-gradient(#f7f7f7, #fcfcfc);
    padding: 15px 20px;
    .columns{
      margin-top:0;
      margin-left:0;
      margin-right:0;
      .column{
        padding:0;
      }
    }
    .top-labels{
      display:flex;
      align-items: center;
      margin-bottom: 0 !important;
      .current-accomplished{
        font-family: Oswald, sans-serif;
        font-size:28px;
      }
      .goal-accomplished{
        font-size:11px;
        letter-spacing: normal;
        opacity:0.6;
      }
    }
    .week {
      margin-top:10px;
      margin-bottom:5px!important;
      .day {
        &.accomplished {
          .date {
            background-color: $color-green;
          }
        }
        &.failed {
          .date {
            border: 2px solid rgba(232, 48, 138, 0.2);
            -webkit-background-clip: padding-box; /* for Safari */
            background-clip: padding-box; /* for IE9+, Firefox 4+, Opera, Chrome */
            background-color: $color-purple;
          }
        }
        .date {
          height: 35px;
          width: 35px;
          background-color: #d5d5d5;
          display: inline-block;
          border-radius: 100%;
          color: #fff;

          p {
            margin: 0;
            padding: 2.5px 0;
          }
        }
      }
    }
  }
</style>