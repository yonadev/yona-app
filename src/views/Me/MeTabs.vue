<template>
  <div id="me" class="header-template" :loading="loading">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        <router-link :to="{ name: 'Profile' }">
          <profile-pic class="profile-img" src="user_image"></profile-pic>
          <span class="dashboard-title">{{ $t("dashboard") }}</span>
        </router-link>
        <router-link :to="{ name: 'Notifications' }">
          <img
            class="small-top-icon is-pulled-right"
            src="@/assets/images/icons/icn_notification.svg"
          />
          <span class="small-top-icon notification-amount is-pulled-right">{{
            notifications
          }}</span>
        </router-link>
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <router-link
            tag="li"
            :to="{ name: 'MeTimeLineDay' }"
            active-class="is-active"
          >
            <a>{{ $t("perday") }}</a>
          </router-link>
          <router-link
            tag="li"
            :to="{ name: 'MeTimeLineWeek' }"
            active-class="is-active"
          >
            <a>{{ $t("perweek") }}</a>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import Component from "vue-class-component";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";

@Component({
  components: { ProfilePic }
})
export default class MeTabs extends Vue {
  @State("account") account!: AccountState;
  @State("api") api!: ApiState;
  loading: boolean = false;
  notifications: number = 0;

  async mounted() {
    if (this.api.links && this.api.links["yona:messages"]) {
      this.loading = true;
      let messages = await axios
        .get(this.api.links["yona:messages"].href)
        .catch((error: any) => {
          console.log(error);
        });

      this.loading = false;

      if (
        messages &&
        messages.data._embedded &&
        messages.data._embedded["yona:messages"]
      ) {
        messages.data._embedded["yona:messages"].forEach((message: any) => {
          if (message["@type"] === "BuddyConnectRequestMessage") {
            this.getPhoto(message);
          }
          if (!message.isRead) {
            this.notifications++;
          }
        });
      }
    }
  }

  async getPhoto(message: any) {
    let hasPhoto = false;

    if (message._links["yona:userPhoto"]) {
      const userPhotoResponse: any = await axios.get(
        message._links["yona:userPhoto"].href,
        {
          responseType: "arraybuffer"
        }
      );

      if (userPhotoResponse) {
        // @ts-ignore
        const userPhoto = new Buffer.from(
          userPhotoResponse.data,
          "binary"
        ).toString("base64");
        window.localStorage.setItem(
          message._links["yona:userPhoto"].href,
          JSON.stringify({
            type: "buddy",
            src: "data:image/png;base64," + userPhoto
          })
        );
        hasPhoto = true;
      }
    }

    if (!hasPhoto) {
      window.localStorage.setItem(
        message._links.self.href,
        JSON.stringify({
          type: "buddy",
          text:
            message._embedded["yona:user"].firstName.charAt(0) +
            message._embedded["yona:user"].lastName.charAt(0)
        })
      );
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";
#me {
  .profile-img {
    width: 2.9rem;
    height: 2.9rem;
    margin-right: 20px;
    display: inline-block;
    border-radius: 50%;
    img {
      width: 2.9rem;
      height: 2.9rem;
      background-color: #915c80;
      margin-right: 20px;
      display: inline-block;
      border-radius: 50%;
    }
  }
  .small-top-icon {
    vertical-align: middle;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    position: relative;
    &.notification-amount {
      background-color: $color-purple;
      width: 2rem;
      height: 2rem;
      display: block;
      padding: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
    }
  }
  .dashboard-title {
    display: inline-block;
    vertical-align: top;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .nav-title {
    padding: 30px 15px 10px 15px;
  }
  .wrapper {
    padding: 0;
    &.grey-bg {
      background-color: #f3f3f3;
    }
  }
}
</style>
