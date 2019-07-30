<template>
  <div>
    <div
      v-for="(day_activities, index) in dayActivityOverviews"
      :key="'day' + index"
    >
      <ui-controls-label
        :buddy_href="buddy_href"
        :day_activities="day_activities"
      ></ui-controls-label>
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
import axios from "@/utils/axios/axios";
import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";
import { Prop } from "vue-property-decorator";
import { Buddy } from "@/store/buddies/types";

@Component({
  components: {
    UiControlsLabel
  }
})
export default class FriendsTimeLineDay extends Vue {
  @Prop() buddy_href!: string;
  dayActivityOverviews: any = [];
  gettingActivities: boolean = false;
  nextActivities: string = "";

  @Getter("buddy", { namespace: "buddies" })
  public buddy!: (buddy_href: string) => Buddy;

  get buddyProfile() {
    return this.buddy(this.buddy_href);
  }

  async mounted() {
    await this.getActivities(
      true,
      true,
      this.buddyProfile._links["yona:dailyActivityReports"].href
    );
  }

  async getActivities(isVisible: boolean, entry: any, href: string) {
    if (isVisible && !this.gettingActivities) {
      if (href) {
        let self = this;

        this.gettingActivities = true;

        let response: any = await axios.get(href).catch(error => {
          console.log(error);
        });

        if (response) {
          if (response.data._links.next) {
            this.nextActivities = response.data._links.next.href;
            this.gettingActivities = false;
          } else {
            this.nextActivities = "";
          }

          response.data._embedded["yona:dayActivityOverviews"].forEach(
            (message: any) => {
              self.dayActivityOverviews.push(message);
            }
          );
        }
      }
    }
  }
}
</script>

<style lang="scss">
.infinite-scroll {
  height: 1px;
  width: 100%;
}
</style>
