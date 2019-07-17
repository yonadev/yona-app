<template>
  <div class="ui-control">
    <div class="columns is-mobile">
      <div class="column is-2"></div>
      <div class="column">
        <p class="has-text-left"><strong>{{controlCategory.name}}</strong></p>
      </div>
    </div>
    <div class="columns is-mobile" v-for="(user_activity, index) in day_activity.dayActivitiesForUsers" :key="'user_activity'+index">
      <div class="column">
        <timeline-control
                @click="detailedViewBuddy(user_activity._links['yona:dayDetails'].href)"
                v-if="user_activity._links['yona:buddy']"
                :user_image="userPhoto(buddy(user_activity._links['yona:buddy'].href)._embedded['yona:user']._links['yona:userPhoto'].href)"
                :username="buddy(user_activity._links['yona:buddy'].href).nickname"
                :goal="buddyGoal(user_activity._links['yona:buddy'].href, user_activity._links['yona:goal'].href)"
                :day_activity="user_activity">
        </timeline-control>
        <timeline-control
                @click="detailedViewUser(user_activity._links['yona:dayDetails'].href)"
                v-else
                :user_image="userPhoto(account.userphoto)"
                :username="account.nickname"
                :goal="userGoal(user_activity._links['yona:goal'].href)"
                :day_activity="user_activity">
        </timeline-control>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import {ActivityCategory, Goal} from "@/store/challenges/types";
  import {Getter, State} from "vuex-class";
  import TimelineControl from "@/components/UiControls/TimelineControl.vue";
  import {Buddy} from "@/store/buddies/types";
  import {AccountState} from "@/store/account/types";

  @Component({
    components: {
      TimelineControl
    }
  })
  export default class TimelineCategory extends Vue {
    @State('account') account!: AccountState;
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

    @Getter('goal', {namespace: 'challenges'})
    public userGoal!: (href: string) => Goal;

    @Getter('goal', {namespace: 'buddies'})
    public buddyGoal!: (buddy_href:string, href: string) => Goal;

    @Getter('buddy', {namespace: 'buddies'})
    public buddy!: (href: string) => Buddy;

    @Getter('activityCategory', {namespace: 'challenges'})
    public activityCategory!: (href: string) => ActivityCategory;

    get controlCategory() {
      return this.activityCategory(this.day_activity._links["yona:activityCategory"].href)
    }

    userPhoto(href: string){
      return window.localStorage.getItem(href);
    }

    detailedViewUser(link: string){
      this.$router.push({'name': 'DetailedViewDay', params: {activity_link: link}})
    }

    detailedViewBuddy(){
      //this.$router.push({'name': 'DetailedViewDay', params: {activity_link: this.detail_link}})
    }
  }
</script>

<style lang="scss">
  @import "../../sass/variables";
  .ui-control{
    background: #f7f7f7; /* Old browsers */
    background: -moz-linear-gradient(top, #f7f7f7 0%, #fcfcfc 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #f7f7f7 0%,#fcfcfc 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #f7f7f7 0%,#fcfcfc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#fcfcfc',GradientType=0 ); /* IE6-9 */

    padding: 0 1.5rem;
    .top-labels{
      display:flex;
      align-items: center;
      margin-bottom: 0 !important;
      margin-top: 0 !important;


      > .column {
        padding: 1.5rem .75rem;
        line-height: 1 !important;
      }

      .current-minutes{
        font-family: Oswald, sans-serif;
        font-size:28px;

        &.warning {
          color: $color-purple;
        }

      }
      .minutes-budget{
        font-size:10px;
        opacity:0.6;
      }
    }

    svg {
      margin-bottom: 1.5rem;
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