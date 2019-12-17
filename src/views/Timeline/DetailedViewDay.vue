<template>
  <div id="detailed-day" class="header-template">
    <div
      class="colored-background"
      :class="buddy_href ? 'blue' : 'purple-dark'"
    >
      <div class="nav-title" v-if="day_activity">
        {{ category }}
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
      <div class="top-label columns is-mobile" v-if="day_activity">
        <div class="column has-text-left">
          <img
            svg-inline
            class="icn-back"
            :class="{ disabled: day_activity._links.prev === undefined }"
            src="@/assets/images/icons/icn_back.svg"
            @click="goToOther(day_activity._links.prev)"
          />
        </div>
        <div class="column">
          <strong>{{ getDayLabel(day_activity.date).toUpperCase() }}</strong>
        </div>
        <div class="column has-text-right">
          <img
            svg-inline
            class="icn-next"
            :class="{ disabled: day_activity._links.next === undefined }"
            src="@/assets/images/icons/icn_back.svg"
            @click="goToOther(day_activity._links.next)"
          />
        </div>
      </div>

      <ui-control
        v-if="day_activity"
        :buddy_href="buddy_href"
        :day_activity="day_activity"
        type="detailed"
      ></ui-control>
      <div v-if="url" class="grey-bg-div has-text-left">
        <div class="sub-title">
          <strong>{{ $t("link") }}</strong>
        </div>
        {{ url }}
      </div>
      <messages
        v-if="day_activity && day_activity._links['yona:messages']"
        :message_link="day_activity._links['yona:messages'].href"
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
import { Getter, State } from "vuex-class";
import { ActivityCategory, Goal } from "@/store/challenges/types";
import { Buddy } from "@/store/buddies/types";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
import Messages from "@/components/Messages/Messages.vue";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    Messages,
    ProfilePic,
    UiControl
  }
})
export default class DetailedViewDay extends Vue {
  @Prop() activity_link!: string;
  @Prop({ default: "" }) buddy_href!: string;
  @Prop() thread!: any;
  @Prop() url!: string;

  @Getter("buddy", { namespace: "buddies" })
  public buddy!: (buddy_href: string) => Buddy;

  @Getter("goal", { namespace: "challenges" })
  public goal!: (href: string) => Goal;

  @Getter("goal", { namespace: "buddies" })
  public buddy_goal!: (buddy_href: string, href: string) => Goal;

  @Getter("activityCategory", { namespace: "challenges" })
  public getActivityCategory!: (href: string) => ActivityCategory;

  day_activity: {
    goalAccomplished: boolean;
    totalActivityDurationMinutes: number;
    totalMinutesBeyondGoal: number;
    _links: {
      [key: string]: {
        href: string;
      };
    };
  } | null = null;
  category: string = "";
  loading: boolean = false;

  async mounted() {
    this.loading = true;

    let detailed_response: any = await axios.get(this.activity_link).catch();

    this.loading = false;

    if (detailed_response.status === 200) {
      this.day_activity = detailed_response.data;

      let goal;
      if (this.day_activity) {
        if (this.buddy_href) {
          goal = this.buddy_goal(
            this.buddy_href,
            this.day_activity._links["yona:goal"].href
          );
        } else {
          goal = this.goal(this.day_activity._links["yona:goal"].href);
        }

        this.category = this.getActivityCategory(
          goal._links["yona:activityCategory"].href
        ).name;
      }
    }
  }

  get buddyProfile() {
    return this.buddy(this.buddy_href);
  }

  goToOther(link: { href: string }) {
    if (link && link.href)
      this.$router.push({
        name: this.buddy_href ? "FriendsDetailedViewDay" : "DetailedViewDay",
        params: { buddy_href: this.buddy_href, activity_link: link.href }
      });
  }

  getDayLabel(date: any) {
    let now = new Date();
    let date_obj = new Date(date);
    let days = [
      "ZONDAG",
      "MAANDAG",
      "DINSDAG",
      "WOENSDAG",
      "DONDERDAG",
      "VRIJDAG",
      "ZATERDAG"
    ];
    let months = [
      "JANUARI",
      "FEBRUARI",
      "MAART",
      "APRIL",
      "MEI",
      "JUNI",
      "JULI",
      "AUGUSTUS",
      "SEPTEMBER",
      "OKTOBER",
      "NOVEMBER",
      "DECEMBER"
    ];

    if (now.getDate() === date_obj.getDate()) date = this.$t("today");
    else if (now.getDate() - 1 === date_obj.getDate())
      date = this.$t("yesterday");
    else
      date =
        days[date_obj.getDay()] +
        ", " +
        date_obj.getDate() +
        " " +
        months[date_obj.getMonth()];

    return date;
  }
}
</script>

<style lang="scss">
#detailed-day {
  .nav-title {
    padding: 30px 15px 5px 25px;
    line-height: 2.5rem;
    min-height: 2.5rem;
    .small-top-icon {
      vertical-align: middle;
      width: 2.5rem;
      height: 2.5rem;
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

    .sub-title {
      padding: 15px 0;
      border-bottom: 1px solid #f3f3f3;
      margin-bottom: 15px;
    }

    .ui-control {
      padding: 15px 25px;
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
    }
    .top-label {
      background: #e7e7e7;
      padding: 17px;
      font-size: 0.9rem;
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
