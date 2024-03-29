<template>
  <div>
    <Component
      class="ui-control"
      :is="controlComponent"
      :goal="controlGoal"
      :title="controlCategory"
      :dayActivity="day_activity"
    ></Component>
    <spread-control
      v-if="type === 'detailed'"
      class="ui-control"
      :goal="controlGoal"
      :dayActivity="day_activity"
      :title="$t('spreiding')"
    ></spread-control>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { ActivityCategory, Goal } from "@/store/challenges/types";
import { Getter } from "vuex-class";
import NoGoControl from "./Controls/NoGoControl.vue";
import SpreadControl from "./Controls/SpreadControl.vue";
import TimeBucketControl from "./Controls/TimeBucketControl.vue";
import TimeFrameControl from "./Controls/TimeFrameControl.vue";

@Component({
  components: {
    NoGoControl,
    SpreadControl,
    TimeBucketControl,
    TimeFrameControl,
  },
})
export default class UiControl extends Vue {
  @Prop() type!: string;
  @Prop({
    default: "",
  })
  buddy_href!: string;
  @Prop() day_activity!: {
    goalAccomplished: boolean;
    totalActivityDurationMinutes: number;
    totalMinutesBeyondGoal: number;
    _links: {
      [key: string]: {
        href: string;
      };
    };
  };

  @Getter("goal", { namespace: "challenges" })
  public goal!: (href: string, historyItem: boolean) => Goal;

  @Getter("goal", { namespace: "buddies" })
  public buddy_goal!: (buddy_href: string, href: string) => Goal;

  @Getter("activityCategory", { namespace: "challenges" })
  public activityCategory!: (href: string) => ActivityCategory;

  get controlGoal() {
    if (typeof this.day_activity !== "undefined") {
      if (this.buddy_href) {
        return this.buddy_goal(
          this.buddy_href,
          this.day_activity._links["yona:goal"].href
        );
      } else {
        return this.goal(this.day_activity._links["yona:goal"].href, true);
      }
    }
    return undefined;
  }

  get controlCategory() {
    if (this.type === "simple") {
      if (typeof this.controlGoal !== "undefined") {
        return this.activityCategory(
          this.controlGoal._links["yona:activityCategory"].href
        ).name;
      } else {
        return null;
      }
    } else {
      return "Score";
    }
  }

  get controlComponent() {
    if (
      typeof this.controlGoal !== "undefined" &&
      typeof this.controlCategory !== "undefined"
    ) {
      if (
        this.controlGoal["@type"] === "BudgetGoal" &&
        this.controlGoal.maxDurationMinutes === 0
      ) {
        return NoGoControl;
      } else if (this.controlGoal["@type"] === "BudgetGoal") {
        return TimeBucketControl;
      } else {
        return TimeFrameControl;
      }
    }
    return undefined;
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";
.ui-control {
  background: #f7f7f7; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #f7f7f7 0%,
    #fcfcfc 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #f7f7f7 0%,
    #fcfcfc 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #f7f7f7 0%,
    #fcfcfc 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#fcfcfc',GradientType=0 ); /* IE6-9 */

  padding: 0 1.5rem;
  .top-labels {
    display: flex;
    align-items: center;
    margin-bottom: 0 !important;
    margin-top: 0 !important;

    > .column {
      padding: 1.5rem 0.75rem;
      line-height: 1 !important;
    }

    .current-minutes {
      font-family: Oswald, sans-serif;
      font-size: 2.5rem;

      &.warning {
        color: $color-purple;
      }
    }
    .minutes-budget {
      font-size: 0.8rem;
      opacity: 0.6;
    }
  }

  svg {
    margin-bottom: 1.5rem;
  }

  .bar {
    height: 25px;
    width: 100%;
    background-color: #e7e7e7;
    margin-bottom: 10px;
    .filler {
      height: 100%;
      background-color: $color-green;
    }
  }
}
</style>
