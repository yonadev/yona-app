<template>
  <div :loading="loading">
    <div
      v-for="(week_activities, index) in weekActivityOverviews"
      :key="'week' + index"
    >
      <week-score-label
        :week_activities="week_activities"
        :buddy_href="buddy_href"
      ></week-score-label>
    </div>
    <div
      class="infinite-scroll"
      v-observe-visibility="
        (isVisible, entry) => getActivities(isVisible, entry, nextActivities)
      "
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Getter, State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import WeekScoreLabel from "@/components/WeekScore/WeekScoreLabel.vue";
import { Prop } from "vue-property-decorator";
import { Buddy } from "@/store/buddies/types";

@Component({
  components: {
    WeekScoreLabel
  }
})
export default class FriendsTimeLineWeek extends Vue {
  @Prop() buddy_href!: string;
  weekActivityOverviews: any = [];
  gettingActivities: boolean = false;
  nextActivities: string = "";
  loading: boolean = false;

  @Getter("buddy", { namespace: "buddies" })
  public buddy!: (buddy_href: string) => Buddy;

  get buddyProfile() {
    return this.buddy(this.buddy_href);
  }

  async mounted() {
    await this.getActivities(
      true,
      true,
      this.buddyProfile._links["yona:weeklyActivityReports"].href
    );
  }

  async getActivities(isVisible: boolean, entry: any, href: string) {
    if (isVisible && !this.gettingActivities) {
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
