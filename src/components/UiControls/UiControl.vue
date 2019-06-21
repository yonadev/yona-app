<template>
  <div class="ui-control">
    <div v-if="goal['@type'] === 'BudgetGoal'">
      <div class="columns is-mobile top-labels">
        <div class="column has-text-left">
          <strong>{{activityCategory.name}}</strong>
        </div>
        <div class="column is-2 current-minutes">
          {{day_activity.totalActivityDurationMinutes}}
        </div>
        <div class="column has-text-right">
          <span class="minutes-budget" v-if="">minuten tegoed</span>
        </div>
      </div>
      <div class="bar">

      </div>
      <div class="columns is-mobile">
        <div class="column has-text-left">0</div>
        <div class="column has-text-right">{{goal.maxDurationMinutes}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import axios from "../../utils/axios/axios"

  @Component({

  })
  export default class UiControls extends Vue {
    @Prop() day_activity: string;
    goal: {} = {};
    activityCategory: {} = {};
    //dayDetails: {} = {};

    async mounted(){
      let goal_response: any = await axios.get(this.day_activity._links['yona:goal'].href).catch((error) => {
        console.log(error)
      });

      if(goal_response.status === 200)
        this.goal = goal_response.data

      let category_response: any = await axios.get(this.goal._links['yona:activityCategory'].href).catch((error) => {
        console.log(error)
      });

      if(category_response.status === 200)
        this.activityCategory = category_response.data

      /* let details_response: any = await axios.get(this.day_activity._links['yona:dayDetails'].href).catch((error) => {
       console.log(error)
     });

     if(details_response.status === 200)
       this.dayDetails = details_response.data */
    }
  }
</script>

<style lang="scss">
  .ui-control{
    min-height: 45px;
    padding: 15px 25px;
    .current-minutes{
      font-family: Oswald, sans-serif;
      font-size:28px;
    }
    .minutes-budget{
      font-size:10px;
      opacity:0.6;
    }
    .top-labels{
      display:flex;
      align-items: center;
      margin-bottom: 0 !important;
    }
    .bar{
      height:25px;
      width:100%;
      background-color:#e7e7e7;
      margin-bottom:10px;
    }
  }
</style>