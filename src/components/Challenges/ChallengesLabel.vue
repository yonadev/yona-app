<template>
  <router-link
    :to="{
      name: 'ChallengesSetup',
      params: {
        category: goal._links['yona:activityCategory'].href,
        goal_url: goal._links.self.href,
        type
      }
    }"
  >
    <div class="grey-bg-button">
      <strong>{{
        activityCategory(goal._links["yona:activityCategory"].href).name
      }}</strong>
      <p v-if="goal['@type'] == 'BudgetGoal' && goal.maxDurationMinutes > 0">
        {{
          $t("challengesbudgetsubtext", { minutes: goal.maxDurationMinutes })
        }}
      </p>
      <p v-else-if="goal['@type'] == 'TimeZoneGoal'">
        {{ $t("challengestimzoesubtext") }}
        {{ goal.zones.join($t("challengestimzoebetweentext")) }}
      </p>
      <p v-else-if="goal['@type'] == 'BudgetGoal'">
        {{ $t("challengesnogosubText") }}
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import axios from "@/utils/axios/axios";
import { ActivityCategory, Goal } from "@/store/challenges/types";
import { Getter, State } from "vuex-class";

@Component({})
export default class ChallengesLabel extends Vue {
  @Prop() goal!: Goal;
  @Prop() type!: string;

  @Getter("activityCategory", { namespace: "challenges" })
  public activityCategory!: (href: string) => ActivityCategory;
}
</script>

<style lang="scss">
.ui-controls {
  min-height: 50px;
  .top-label {
    background: #e7e7e7;
    padding: 17px;
    font-size: 0.9rem;
    opacity: 0.6;
    border-bottom: 1px solid #d5d5d5;
    border-top: 1px solid #d5d5d5;
  }
}
</style>
