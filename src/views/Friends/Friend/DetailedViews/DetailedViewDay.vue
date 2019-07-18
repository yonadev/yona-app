<template>
  <div id="detailed-day" class="header-template">
    <div class="colored-background blue">
      <div class="nav-title" v-if="day_activity">
        {{controlCategory}}
        <router-link :to="{name: 'FriendsProfile', params:{ buddy_href: buddy_href }}">
          <profile-pic class="small-top-icon is-pulled-right" :src="buddyProfile._embedded['yona:user']._links.self.href"></profile-pic>
        </router-link>
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div class="top-label columns is-mobile" v-if="day_activity">
        <div class="column has-text-left">
          <img svg-inline class="icn-back" :class="{'disabled': day_activity._links.prev === undefined}" src="@/assets/images/icons/icn_back.svg" @click="goToOther(day_activity._links.prev)" />
        </div>
        <div class="column">
          <strong>{{getDayLabel(day_activity.date)}}</strong>
        </div>
        <div class="column has-text-right">
          <img svg-inline class="icn-next" :class="{'disabled': day_activity._links.next === undefined}" src="@/assets/images/icons/icn_back.svg" @click="goToOther(day_activity._links.next)" />
        </div>
      </div>
      <Component class="ui-control" :is="controlComponent" :goal="controlGoal" :title="controlCategory" :dayActivity="day_activity"></Component>
      <spread-control v-if="day_activity" class="ui-control" :goal="controlGoal" :dayActivity="day_activity" title="Spreiding"></spread-control>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop} from 'vue-property-decorator'
  import axios from "../../../../utils/axios/axios"
  import UiControl from "../../../../components/UiControls/UiControl.vue";
  import {Getter} from "vuex-class";
  import {ActivityCategory, Goal} from "../../../../store/challenges/types";
  import SpreadControl from "../../../../components/UiControls/Controls/SpreadControl.vue";
  import NoGoControl from "../../../../components/UiControls/Controls/NoGoControl.vue";
  import TimeBucketControl from "../../../../components/UiControls/Controls/TimeBucketControl.vue";
  import TimeFrameControl from "../../../../components/UiControls/Controls/TimeFrameControl.vue";
  import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
  import {Buddy} from "@/store/buddies/types";

  @Component({
    components: {
      ProfilePic,
      TimeFrameControl,
      TimeBucketControl,
      NoGoControl,
      SpreadControl,
      UiControl
    }
  })
  export default class DetailedViewDay extends Vue {
    @Prop() activity_link!: string;
    @Prop() buddy_href!: string;

    @Getter('buddy', {namespace: 'buddies'})
    public buddy!: (buddy_href: string) => Buddy;

    @Getter('goal', {namespace: 'buddies'})
    public goal!: (buddy_href: string, href: string) => Goal;

    @Getter('activityCategory', {namespace: 'challenges'})
    public activityCategory!: (href: string) => ActivityCategory;

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
      }
    }

    get buddyProfile(){
      return this.buddy(this.buddy_href);
    }

    get controlGoal() {
      if(this.day_activity) {
        return this.goal(this.buddy_href, this.day_activity._links['yona:goal'].href)
      }
      return undefined;
    }

    get controlCategory() {
      if (typeof this.controlGoal !== 'undefined') {
        return this.activityCategory(this.controlGoal._links["yona:activityCategory"].href).name
      } else {
        return null;
      }
    }

    get controlComponent() {
      if(typeof this.controlGoal !== 'undefined' && typeof this.controlCategory !== 'undefined') {
        if(this.controlGoal["@type"] === 'BudgetGoal' && this.controlGoal.maxDurationMinutes === 0) {
          return NoGoControl;
        } else if(this.controlGoal["@type"] === 'BudgetGoal') {
          return TimeBucketControl;
        } else {
          return TimeFrameControl;
        }
      }
      return undefined;
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
      line-height:30px;
      .small-top-icon{
        vertical-align: middle;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: relative;
        img{
          border-radius:50%;
        }
      }
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