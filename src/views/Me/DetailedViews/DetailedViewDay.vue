<template>
  <div id="detailed-day" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{category}}
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div class="top-label columns is-mobile"  v-if="day_activity">
        <div class="column has-text-left">
          <img svg-inline class="icn-back" :class="{'disabled': day_activity._links.prev === undefined}" src="@/assets/images/icons/icn_back.svg" @click="goToOther(day_activity._links.prev)" />
        </div>
        <div class="column">
          <strong >{{getDayLabel(day_activity.date)}}</strong>
        </div>
        <div class="column has-text-right">
          <img svg-inline class="icn-next" :class="{'disabled': day_activity._links.next === undefined}" src="@/assets/images/icons/icn_back.svg" @click="goToOther(day_activity._links.next)" />
        </div>
      </div>

      <ui-control v-if="day_activity" :day_activity="day_activity" type="detailed"></ui-control>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop} from 'vue-property-decorator'
  import axios from "@/utils/axios/axios"
  import UiControl from "@/components/UiControls/UiControl.vue";
  import {Getter} from "vuex-class";
  import {ActivityCategory, Goal} from "@/store/challenges/types";

  @Component({
    components: {
      UiControl
    }
  })
  export default class DetailedViewDay extends Vue {
    @Prop() activity_link!: string;

    @Getter('goal', {namespace: 'challenges'})
    public getGoal!: (href: string) => Goal;

    @Getter('activityCategory', {namespace: 'challenges'})
    public getActivityCategory!: (href: string) => ActivityCategory;

    day_activity: {
      goalAccomplished: boolean,
      totalActivityDurationMinutes: number,
      totalMinutesBeyondGoal: number,
      _links: {
        [key: string]: {
          href: string
        }
      }
    } | null = null;
    category: string = '';
    loading: boolean = false;

    async mounted() {
      this.loading = true;

      let detailed_response: any = await axios.get(this.activity_link).catch((error) => {
        console.log(error)
      });

      if(detailed_response.status === 200) {
        this.day_activity = detailed_response.data;

        if(this.day_activity) {
          const goal = this.getGoal(this.day_activity._links['yona:goal'].href);
          this.category = this.getActivityCategory(goal._links['yona:activityCategory'].href).name

          this.loading = false;
        }
      }
    }

    goToOther(link: {href:string}){
      if(link && link.href)
        this.$router.push({'name': 'DetailedViewDay', params: {activity_link: link.href}})
    }

    getDayLabel(date: any){
      let now = new Date();
      let date_obj = new Date(date);
      let days = ["ZONDAG", "MAANDAG", "DINSDAG", "WOENSDAG", "DONDERDAG", "VRIJDAG", "ZATERDAG"];
      let months = ["JANUARI", "FEBRUARI", "MAART", "APRIL", "MEI", "JUNI", "JULI", "AUGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DECEMBER"];

      if(now.getDate() === date_obj.getDate())
        date = 'VANDAAG';
      else if((now.getDate()-1) === date_obj.getDate())
        date = 'GISTEREN';
      else
        date = days[date_obj.getDay()]+', '+date_obj.getDate()+' '+months[date_obj.getMonth()];

      return date
    }
  }
</script>

<style lang="scss">
  #detailed-day{
    .nav-title{
      padding:30px 15px 15px 25px;
    }
    .wrapper {
      padding: 0;

      .grey-bg-div {
        background-image: linear-gradient(#f7f7f7, #fcfcfc);
        padding: 15px 25px 15px 25px;

        &.is-not-read {
          background: #ecf2f8;
        }
      }

      .ui-control{
        padding: 15px 25px;
        background-image: linear-gradient(#f7f7f7, #fcfcfc);
      }
      .top-label{
        background:#e7e7e7;
        padding: 17px;
        font-size: 11px;
        opacity: 0.6;
        border-bottom:1px solid #d5d5d5;
        border-top:1px solid #d5d5d5;
        margin:0;
        display:flex;
        align-items: center;

        .column{
          padding:0 5px;
        }

        svg{
          width:20px;
          height:20px;
          color:rgba(0, 0, 0, 0.7);
          &.disabled{
            color:rgba(0, 0, 0, 0.2);
          }
        }

        .icn-next{
          transform: rotate(180deg);
        }
      }
    }
  }
</style>