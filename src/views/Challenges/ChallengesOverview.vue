<template>
  <div id="challenges" class="header-template">
    <div class="wrapper grey-bg">
      <div class="challenge-header">
        <div class="add-button" v-if="unusedCategories.length > 0">
          <router-link :to="{ name: 'ChallengesCategoryChoose' }">
            <img :src="require('@/assets/images/challenges/add_circel.svg')" />
          </router-link>
        </div>
        <div class="text" v-if="type === 'credit'">
          {{ $t("challenge_budget_title") }}
        </div>
        <div class="text" v-else-if="type === 'timezone'">
          {{ $t("challenge_timezone_title") }}
        </div>
        <div class="text" v-else-if="type === 'nogo'">
          {{ $t("challengesnogoheader") }}
        </div>
        <br clear="left" />
      </div>

      <challenges-label
        v-for="(goal, index) in goalsByType(challengeType)"
        :key="index"
        :goal="goal"
        :type="type"
      ></challenges-label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action, Getter, State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import { Prop } from "vue-property-decorator";
import {
  ActivityCategory,
  ChallengesState,
  Goal,
} from "@/store/challenges/types";

import ChallengesLabel from "@/components/Challenges/ChallengesLabel.vue";

@Component({
  components: { ChallengesLabel },
})
export default class Add extends Vue {
  @State("challenges") challenges!: ChallengesState;
  @State("api") api!: ApiState;
  @Prop() type!: string;
  @Action("setSetupType", { namespace: "challenges" }) setSetupType: any;
  @Action("update", { namespace: "challenges" }) update: any;

  @Getter("goalsByType", { namespace: "challenges" })
  public goalsByType!: (type: string) => Goal[];

  @Getter("unusedCategories", { namespace: "challenges" })
  public unusedCategories!: (href: string) => ActivityCategory[];

  goalType: string = "";
  goals: any = null;

  //Cycle hooks
  mounted() {
    this.goalType = this.type;
    this.update();
  }

  get challengeType(): string {
    switch (this.type) {
      case "credit":
        return "BudgetGoal";
      case "timezone":
        return "TimeZoneGoal";
      case "nogo":
        return "NoGoGoal";
    }
    return "";
  }

  //Methods
  chooseSetup() {
    this.$router.push({ name: "ChallengesCategoryChoose" });
  }

  chooseCategory(category: any) {
    this.$router.push({ name: "ChallengesSetup" });
  }

  beforeRouteUpdate(to: any, from: any, next: any) {
    this.goalType = to.params.type;
    next();
  }
}
</script>
<style lang="scss">
@import "../../sass/variables";
#challenges {
  .wrapper {
    padding: 0;

    .challenge-header {
      padding: 20px 0 20px 25px;
      text-align: left;
      position: relative;
      background-color: $list-background;

      .text {
        padding-top: 10px;
      }

      .add-button {
        float: right;
        padding: 0 15px;

        a {
          display: block;
        }
      }
    }

    .grey-bg-button {
      background-image: linear-gradient(
        $list-item-gradient-two,
        $list-item-gradient-one
      );
      padding: 20px 25px 20px 25px;
      text-align: left;
    }
  }
}
</style>
