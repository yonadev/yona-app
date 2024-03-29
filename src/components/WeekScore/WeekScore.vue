<template>
  <div class="week-score-day">
    <div class="columns is-mobile top-labels">
      <div class="column has-text-left">
        <strong>{{ controlCategory }}</strong>
      </div>
      <div class="column is-2 current-accomplished">
        {{ getAccomplishedCount(week_activity.dayActivities) }}
      </div>
      <div class="column has-text-right">
        <span class="goal-accomplished">{{ $t("week_score") }}</span>
      </div>
    </div>
    <div class="columns is-mobile is-centered is-1-mobile is-variable week">
      <span
        class="day column"
        v-for="(day_of_week, index) in day_of_weeks"
        :key="'day' + day_of_week"
        :class="{
          accomplished:
            week_activity.dayActivities[day_of_week] &&
            week_activity.dayActivities[day_of_week].goalAccomplished,
          failed:
            week_activity.dayActivities[day_of_week] &&
            !week_activity.dayActivities[day_of_week].goalAccomplished,
        }"
      >
        <router-link
          v-if="detailed && week_activity.dayActivities[day_of_week]"
          :to="{
            name: 'DetailedViewDay',
            params: {
              activity_link:
                week_activity.dayActivities[day_of_week]._links[
                  'yona:dayDetails'
                ].href,
              buddy_href,
            },
          }"
        >
          <span class="date">
            <p>
              {{ day_initial_of_week[$i18n.locale][index] }}<br />
              {{ getDate(index) }}
            </p>
          </span>
        </router-link>
        <span v-else class="date">
          <p>
            {{ day_initial_of_week[$i18n.locale][index] }}<br />
            {{ getDate(index) }}
          </p>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import moment from "moment";
import axios from "../../utils/axios/axios";
import { Getter } from "vuex-class";
import { ActivityCategory, Goal } from "@/store/challenges/types";

@Component({})
export default class WeekScore extends Vue {
  @Prop() week_activity!: {
    _links: {
      [key: string]: {
        href: string;
      };
    };
  };
  @Prop() week_number!: string;
  @Prop() title!: string;
  @Prop({
    default: false,
  })
  detailed!: boolean;
  @Prop({
    default: "",
  })
  buddy_href!: string;

  @Getter("goal", { namespace: "challenges" })
  public goal!: (href: string, historyItem: boolean) => Goal;

  @Getter("goal", { namespace: "buddies" })
  public buddy_goal!: (buddy_href: string, href: string) => Goal;

  @Getter("activityCategory", { namespace: "challenges" })
  public activityCategory!: (href: string) => ActivityCategory;

  day_of_weeks: [string, string, string, string, string, string, string] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  day_initial_of_week: { nl: string[]; en: string[] } = {
    nl: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    en: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  };

  get controlGoal() {
    if (typeof this.week_activity !== "undefined") {
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

  getAccomplishedCount(activities: any) {
    let count: number = 0;
    Object.keys(activities).forEach((key: string) => {
      if (activities[key].goalAccomplished) count++;
    });
    return count;
  }

  getDate(index: any) {
    return moment(this.week_number, moment.ISO_8601).day(index).get("date");
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";

.week-score-day {
  min-height: 50px;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#f7f7f7),
    to(#fcfcfc)
  );
  background-image: linear-gradient(#f7f7f7, #fcfcfc);
  padding: 15px 20px;
  .columns {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
    .column {
      padding: 0;
    }
  }
  .top-labels {
    display: flex;
    align-items: center;
    margin-bottom: 0 !important;
    .current-accomplished {
      font-family: Oswald, sans-serif;
      font-size: 2.5rem;
    }
    .goal-accomplished {
      font-size: 0.9rem;
      letter-spacing: normal;
      opacity: 0.6;
    }
  }
  .week {
    margin-top: 10px;
    margin-bottom: 5px !important;
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
        height: 2.9rem;
        width: 2.9rem;
        background-color: #d5d5d5;
        display: inline-block;
        border-radius: 100%;
        color: #fff;

        p {
          margin: 0;
          padding: 6px 0;
          line-height: 1.1;
        }
      }
    }
  }
}
</style>
