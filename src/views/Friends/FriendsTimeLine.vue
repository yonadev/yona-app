<template>
  <div id="friends-timeline">
    <div
      v-for="(buddy_activities, index) in buddies_activities"
      :key="'day' + index"
    >
      <ui-controls-label :day_activities="buddy_activities"></ui-controls-label>
    </div>
    <div
      class="infinite-scroll"
      :class="{ loading }"
      v-observe-visibility="
        (isVisible, entry) =>
          this.getActivities(isVisible, entry, nextActivities)
      "
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action, State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";
import { Buddy } from "@/store/buddies/types";

@Component({
  components: {
    UiControlsLabel
  }
})
export default class FriendsTimeLine extends Vue {
  @State("api") api!: ApiState;
  @Action("update", { namespace: "buddies" }) update: any;
  @State(state => state.buddies.buddies) buddies!: Buddy[];
  buddies_activities: any = [];
  gettingActivities: boolean = false;
  nextActivities: string = "";
  loading: boolean = false;

  async mounted() {
    if (
      this.api.links &&
      this.api.links["yona:dailyActivityReportsWithBuddies"]
    ) {
      await this.getActivities(
        true,
        true,
        this.api.links["yona:dailyActivityReportsWithBuddies"].href
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

          if (response.data._embedded) {
            response.data._embedded["yona:dayActivityOverviews"].forEach(
              (message: any) => {
                self.buddies_activities.push(message);
              }
            );
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";

#friends-timeline {
  .nav-title {
    padding: 30px 15px 10px 15px;
  }
  .wrapper {
    padding: 0;
    &.grey-bg {
      background-color: #f3f3f3;
    }
    .top-label {
      background: #e7e7e7;
      padding: 17px;
      font-size: 11px;
      opacity: 0.6;
      border-bottom: 1px solid #d5d5d5;
    }
    .grey-bg-div {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 15px 25px 15px 25px;
      .img-wrapper {
        width: 50px;
        height: 50px;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        border-radius: 100%;
        overflow: hidden;
        position: relative;
        img {
          position: absolute;
          margin: auto;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          text-align: center;
          z-index: 1;
          max-width: 100%;
        }
        .img-placeholder {
          width: 100%;
          height: 100%;
          background-color: $color-purple-dark;
        }
        .profile-img {
          height: 50px;
          width: 50px;
          background-color: $color-purple-dark;
          color: #fff;
          position: relative;
          span {
            padding: 12px 0;
            position: relative;
            display: block;
            font-size: 18px;
          }
        }
      }
      .title {
        margin-bottom: 5px;
        margin-top: 8px;
      }
      .date {
        opacity: 0.6;
      }
    }
  }
}
</style>
