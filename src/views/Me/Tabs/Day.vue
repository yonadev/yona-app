<template>
  <div>
    <div
      v-for="(day_activities, index) in all_day_activities"
      :key="'day' + index"
    >
      <ui-controls-label :day_activities="day_activities"></ui-controls-label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";

@Component({
  components: {
    UiControlsLabel
  }
})
export default class MeTimeLineDay extends Vue {
  @State("api") api!: ApiState;
  all_day_activities: [{}] = [{}];

  async mounted() {
    if (this.api.links) {
      let daily_response = await axios.get(
        this.api.links["yona:dailyActivityReports"].href
      );

      if (daily_response.status == 200)
        this.all_day_activities =
          daily_response.data._embedded["yona:dayActivityOverviews"];
    }
  }
}
</script>

<style lang="scss"></style>
