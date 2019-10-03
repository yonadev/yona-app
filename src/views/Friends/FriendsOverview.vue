<template>
  <div id="friends-overview" :loading="loading">
    <div class="top-label">
      <strong>VERBONDEN</strong>
    </div>
    <div
      v-for="(buddy, index) in buddies"
      :key="'accepted' + index"
      :class="{
        'grey-bg-div': buddy && buddy.receivingStatus === userStatus.Accepted
      }"
    >
      <router-link
        v-if="buddy && buddy.receivingStatus === userStatus.Accepted"
        :to="{
          name: 'FriendTimeLineDay',
          params: { buddy_href: buddy._links.self.href }
        }"
        tag="div"
        class="columns is-mobile is-vcentered"
      >
        <div class="column is-2">
          <div class="img-wrapper">
            <profile-pic
              :src="buddy._embedded['yona:user']._links.self.href"
            ></profile-pic>
          </div>
        </div>
        <div class="column">
          <span class="is-block has-text-left title">
            <strong
              >{{ buddy._embedded["yona:user"].firstName }}
              {{ buddy._embedded["yona:user"].lastName }}</strong
            >
          </span>
          <span class="is-block has-text-left date">
            Laatst gezien: {{ buddy._embedded["yona:user"].appLastOpenedDate }}
          </span>
        </div>
      </router-link>
    </div>
    <div class="top-label">
      <strong>VERZOEKEN</strong>
    </div>
    <div
      v-for="(buddy, index) in buddies"
      :key="'requested' + index"
      :class="{
        'grey-bg-div': buddy && buddy.receivingStatus === userStatus.Requested
      }"
    >
      <div
        v-if="buddy && buddy.receivingStatus === userStatus.Requested"
        class="columns is-mobile"
      >
        <div class="column is-2">
          <div class="img-wrapper">
            <div class="img-placeholder"></div>
          </div>
        </div>
        <div class="column">
          <span class="is-block has-text-left title">
            <strong
              >{{ buddy._embedded["yona:user"].firstName }}
              {{ buddy._embedded["yona:user"].lastName }}</strong
            >
          </span>
          <span class="is-block has-text-left date">
            Heeft nog niet geaccepteerd
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action, State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";
import { Buddy, userStatus } from "@/store/buddies/types";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

@Component({
  components: {
    ProfilePic,
    UiControlsLabel
  }
})
export default class FriendsOverview extends Vue {
  @State("api") api!: ApiState;
  @Action("update", { namespace: "buddies" }) update: any;
  buddies_activities: {} = {};
  loading: boolean = false;
  @State(state => state.buddies.buddies) buddies!: Buddy[];
  userStatus = userStatus;
  @Action("getBuddies", { namespace: "buddies" }) getBuddies: any;

  async mounted() {
    this.loading = true;
    await this.getBuddies();
    this.loading = false;
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
      font-size: 0.9rem;
      opacity: 0.6;
      border-bottom: 1px solid #d5d5d5;
    }
    .grey-bg-div {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 15px 25px 15px 25px;
      .img-wrapper {
        width: 2.5rem;
        height: 2.5rem;
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
          height: 2.5rem;
          width: 2.5rem;
          background-color: $color-purple-dark;
          color: #fff;
          position: relative;
          span {
            padding: 12px 0;
            position: relative;
            display: block;
            font-size: 1.5rem;
          }
        }
      }
      .title {
        margin-bottom: 5px;
      }
      .date {
        opacity: 0.6;
      }
    }
  }
}
</style>
