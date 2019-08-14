<template>
  <div id="ChallengesCategoryChoose" class="header-template">
    <div class="wrapper grey-bg">
      <div class="challenge-header">
        <div class="text">
          {{ headerText }}
        </div>
        <br clear="left" />
      </div>

      <router-link
        v-for="(activityCategory, index) in unusedCategories"
        :key="index"
        :to="{
          name: 'ChallengesSetup',
          params: { category: activityCategory._links.self.href, type: type }
        }"
      >
        <div class="grey-bg-button">
          <strong>{{ activityCategory.name }}</strong>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ActivityCategory } from "@/store/challenges/types";

@Component({})
export default class ChallengesCategoryChoose extends Vue {
  @Prop() type!: string;

  @Getter("unusedCategories", { namespace: "challenges" })
  public unusedCategories!: (href: string) => ActivityCategory[];

  get headerText() {
    switch (this.type) {
      case "nogo":
        return this.$t("challengesnogoheader");
      case "timezone":
        return this.$t("challengestijdzoneheader");
      default:
        return this.$t("challengestegoedheader");
    }
  }
}
</script>
