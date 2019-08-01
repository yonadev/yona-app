<template>
  <div id="detailed-day" class="header-template">
    <div
      class="colored-background"
      :class="buddy_href ? 'blue' : 'purple-dark'"
    >
      <div class="nav-title" v-if="week_activity">
        {{ controlCategory }}
        <router-link
          v-if="buddy_href"
          :to="{ name: 'FriendsProfile', params: { buddy_href: buddy_href } }"
        >
          <profile-pic
            class="small-top-icon is-pulled-right"
            :src="buddyProfile._embedded['yona:user']._links.self.href"
          ></profile-pic>
        </router-link>
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div class="top-label columns is-mobile" v-if="week_activity">
        <div class="column has-text-left">
          <img
            svg-inline
            class="icn-back"
            :class="{ disabled: week_activity._links.prev === undefined }"
            src="@/assets/images/icons/icn_back.svg"
            @click="goToOther(week_activity._links.prev)"
          />
        </div>
        <div class="column">
          <strong>{{ getWeekLabel(week_activity.date) }}</strong>
        </div>
        <div class="column has-text-right">
          <img
            svg-inline
            class="icn-next"
            :class="{ disabled: week_activity._links.next === undefined }"
            src="@/assets/images/icons/icn_back.svg"
            @click="goToOther(week_activity._links.next)"
          />
        </div>
      </div>

      <week-score
        v-if="week_activity"
        :buddy_href="buddy_href"
        :week_activity="week_activity"
        :week_number="week_activity.date"
      ></week-score>
      <time-bucket-control
        v-if="
          week_activity &&
            controlGoal['@type'] === 'BudgetGoal' &&
            controlGoal.maxDurationMinutes > 0
        "
        class="ui-control"
        :goal="controlGoal"
        :dayActivity="{
          totalActivityDurationMinutes:
            week_activity.totalActivityDurationMinutes /
            Object.keys(week_activity.dayActivities).length
        }"
        title="Gemiddeld"
      ></time-bucket-control>
      <spread-control
        v-if="week_activity"
        class="ui-control"
        :goal="controlGoal"
        :dayActivity="week_activity"
        title="Spreiding"
      ></spread-control>
      <messages
        v-if="week_activity && week_activity._links['yona:messages']"
        :message_link="week_activity._links['yona:messages'].href"
        :buddy_href="buddy_href"
        :thread="thread"
      ></messages>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import axios from "@/utils/axios/axios";
import UiControl from "@/components/UiControls/UiControl.vue";
import { Getter } from "vuex-class";
import { ActivityCategory, Goal } from "@/store/challenges/types";
import WeekScore from "@/components/WeekScore/WeekScore.vue";
import moment from "moment";
import SpreadControl from "@/components/UiControls/Controls/SpreadControl.vue";
import TimeBucketControl from "@/components/UiControls/Controls/TimeBucketControl.vue";
import { Buddy } from "@/store/buddies/types";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
import Messages from "@/components/Messages/Messages.vue";

@Component({
  components: {
    Messages,
    ProfilePic,
    TimeBucketControl,
    SpreadControl,
    WeekScore,
    UiControl
  }
})
export default class DetailedViewWeek extends Vue {
  @Prop() activity_link!: string;
  @Prop({ default: "" }) buddy_href!: string;
  @Prop() thread!: any;

  @Getter("buddy", { namespace: "buddies" })
  public buddy!: (buddy_href: string) => Buddy;

  @Getter("goal", { namespace: "challenges" })
  public goal!: (href: string, historyItem: boolean) => Goal;

  @Getter("goal", { namespace: "buddies" })
  public buddy_goal!: (buddy_href: string, href: string) => Goal;

  @Getter("activityCategory", { namespace: "challenges" })
  public activityCategory!: (href: string) => ActivityCategory;

  week_activity: {
    goalAccomplished: boolean;
    totalActivityDurationMinutes: number;
    totalMinutesBeyondGoal: number;
    dayActivities: {};
    _links: {
      [key: string]: {
        href: string;
      };
    };
  } | null = null;
  loading: boolean = false;

  async mounted() {
    this.loading = true;

    let detailed_response: any = await axios
      .get(this.activity_link)
      .catch(error => {
        console.log(error);
      });

    this.loading = false;

    if (detailed_response.status === 200) {
      this.week_activity = detailed_response.data;
    }
  }

  get controlGoal() {
    if (this.week_activity !== null) {
      if (this.buddy_href) {
        return this.buddy_goal(
          this.buddy_href,
          this.week_activity._links["yona:goal"].href
        );
      } else {
        return this.goal(this.week_activity._links["yona:goal"].href, true);
      }
    }
    return undefined;
  }
  get controlCategory() {
    if (typeof this.controlGoal !== "undefined") {
      return this.activityCategory(
        this.controlGoal._links["yona:activityCategory"].href
      ).name;
    } else {
      return null;
    }
  }

  get buddyProfile() {
    return this.buddy(this.buddy_href);
  }

  goToOther(link: { href: string }) {
    if (link && link.href)
      this.$router.push({
        name: this.buddy_href ? "FriendsDetailedViewWeek" : "DetailedViewWeek",
        params: { buddy_href: this.buddy_href, activity_link: link.href }
      });
  }

  getWeekLabel(date: any) {
    let now = moment(new Date())
      .weekday(0)
      .week();
    let week = moment(date, moment.ISO_8601)
      .weekday(0)
      .week();

    if (now === week) return "DEZE WEEK";
    else if (now - 1 === week) return "VORIGE WEEK";
    else
      return (
        moment(date, moment.ISO_8601)
          .isoWeekday(0)
          .format("D MMMM") +
        " - " +
        moment(date, moment.ISO_8601)
          .isoWeekday(6)
          .format("D MMMM")
      );
  }
}
</script>

<style lang="scss">
#detailed-day {
  .nav-title {
    padding: 30px 15px 5px 25px;
    line-height: 30px;
    min-height: 30px;
    .small-top-icon {
      vertical-align: middle;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      position: relative;
      svg {
        height: 30px;
      }
      img {
        border-radius: 50%;
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

    .ui-control {
      padding: 15px 25px;
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
    }
    .top-label {
      background: #e7e7e7;
      padding: 17px;
      font-size: 11px;
      opacity: 0.6;
      border-bottom: 1px solid #d5d5d5;
      border-top: 1px solid #d5d5d5;
      margin: 0;
      display: flex;
      align-items: center;

      .column {
        padding: 0 5px;
      }

      svg {
        width: 20px;
        height: 20px;
        color: rgba(0, 0, 0, 0.7);
        &.disabled {
          color: rgba(0, 0, 0, 0.2);
        }
      }

      .icn-next {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
