<template>
  <div class="ui-control" @click="detailedView">
    <div v-if="type === 'detailed'">
      <div class="columns is-mobile top-labels">
        <div class="column has-text-left">
          <strong>Score</strong>
        </div>
        <div class="column is-2 current-minutes">
          {{day_activity.totalActivityDurationMinutes}}
        </div>
        <div class="column has-text-right">
          <span class="minutes-budget">minuten tegoed</span>
        </div>
      </div>
      <div class="bar">
        <div v-if="!day_activity.totalMinutesBeyondGoal" class="filler" :style="'width:'+(day_activity.totalActivityDurationMinutes*100/goal.maxDurationMinutes)+'%'"></div>
        <div v-else>

        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column has-text-left" v-if="day_activity.totalMinutesBeyondGoal">
          {{day_activity.totalMinutesBeyondGoal}}
        </div>
        <div class="column has-text-left">
          0
        </div>
        <div class="column has-text-right">{{goal.maxDurationMinutes}}</div>
      </div>
    </div>
    <div v-if="type === 'simple'">
      <div v-if="goal['@type'] === 'BudgetGoal'">
        <div class="columns is-mobile top-labels">
          <div class="column has-text-left">
            <strong>{{activityCategory.name}}</strong>
          </div>
          <div class="column is-2 current-minutes">
            {{day_activity.totalActivityDurationMinutes}}
          </div>
          <div class="column has-text-right">
            <span class="minutes-budget">minuten tegoed</span>
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
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import axios from "@/utils/axios/axios"

  @Component({

  })
  export default class UiControls extends Vue {
    @Prop() type!: string;
    @Prop() day_activity!: {
      goalAccomplished: boolean,
      totalActivityDurationMinutes: number,
      totalMinutesBeyondGoal: number,
      _links: {
        [key: string]:{
          href: string
        }
      }
    };
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
    activityCategory: {
      name: string
    } = {
      name: ''
    };

    async mounted() {
      //First get the goal so we can get the category
      if (this.day_activity._links['yona:goal']) {
        let goal_response: any = await axios.get(this.day_activity._links['yona:goal'].href).catch((error) => {
          console.log(error)
        });

        if (goal_response.status === 200) {
          this.goal = goal_response.data
          this.goal.maxDurationMinutes = 30;
          this.day_activity.totalActivityDurationMinutes = 25;
          //this.day_activity.totalMinutesBeyondGoal = 5;

          //Get the category
          let category_response: any = await axios.get(this.goal._links['yona:activityCategory'].href).catch((error) => {
            console.log(error)
          });

          if(category_response.status === 200)
            this.activityCategory = category_response.data
        }
      }
    }

    detailedView(){
      if(this.type === 'simple')
        this.$router.push({'name': 'DetailedViewDay', query: {href: this.day_activity._links['yona:dayDetails'].href}})
    }
  }
</script>

<style lang="scss">
  @import "../../sass/variables";
  .ui-control{
    min-height: 45px;
    padding: 15px 20px;
    .top-labels{
      display:flex;
      align-items: center;
      margin-bottom: 0 !important;
      .current-minutes{
        font-family: Oswald, sans-serif;
        font-size:28px;
      }
      .minutes-budget{
        font-size:10px;
        opacity:0.6;
      }
    }
    .bar{
      height:25px;
      width:100%;
      background-color:#e7e7e7;
      margin-bottom:10px;
      .filler{
        height:100%;
        background-color: $color-green;
      }
    }
  }
</style>