<template>
  <div>
    <div
      v-for="(week_activities, index) in weekActivityOverviews"
      :key="'week' + index"
    >
      <week-score-label :week_activities="week_activities"></week-score-label>
    </div>
    <div
      class="infinite-scroll"
      :class="{loading}"
      v-observe-visibility="
        (isVisible, entry) => getActivities(isVisible, entry, nextActivities)
      "
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import WeekScoreLabel from "@/components/WeekScore/WeekScoreLabel.vue";

@Component({
  components: {
    WeekScoreLabel
  }
})
export default class MeTimeLineWeek extends Vue {
  @State("api") api!: ApiState;
  weekActivityOverviews: any = [];
  gettingActivities: boolean = false;
  nextActivities: string = "";
  loading: boolean = false;

  async mounted() {
    if (this.api.links) {
      await this.getActivities(
        true,
        true,
        this.api.links["yona:weeklyActivityReports"].href
      );
    }
  }

  async getActivities(isVisible: boolean, entry: any, href: string) {
    if (isVisible && !this.gettingActivities && !this.loading) {
      this.loading = true;
      if (href) {
        let self = this;

        this.gettingActivities = true;

        let response: any = await axios.get(href).catch(error => {
          console.log(error);
        });

        this.loading = false;

        if (response) {
          if (response.data._links.next) {
            this.nextActivities = response.data._links.next.href;
            this.gettingActivities = false;
          } else {
            this.nextActivities = "";
          }

          response.data._embedded["yona:weekActivityOverviews"].forEach(
            (message: any) => {
              self.weekActivityOverviews.push(message);
            }
          );
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
