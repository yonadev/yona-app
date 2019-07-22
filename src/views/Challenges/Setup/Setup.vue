<template>
  <Component
    :is="getSetup()"
    :category="category"
    :goal="goal(goal_url)"
  ></Component>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import ChallengesSetupCredit from "./SetupCredit.vue";
import ChallengesSetupTimezone from "./SetupTimezone.vue";
import ChallengesSetupNogo from "./SetupNogo.vue";
import { Getter } from "vuex-class";
import { Goal } from "@/store/challenges/types";

@Component({})
export default class ChallengesSetup extends Vue {
  @Prop() type!: string;
  @Prop() category!: string;
  @Prop() goal_url!: string;

  @Getter("goal", { namespace: "challenges" })
  public goal!: (href: string) => Goal;

  getSetup() {
    switch (this.type) {
      case "credit":
        return ChallengesSetupCredit;
      case "timezone":
        return ChallengesSetupTimezone;
      case "nogo":
        return ChallengesSetupNogo;
    }
  }
}
</script>
