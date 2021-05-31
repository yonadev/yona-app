<template>
  <div id="friend-request" class="profile-template">
    <div class="colored-background blue">
      <div class="heading" v-if="notification">
        <div class="nav-title"></div>
        <div class="wrapper">
          <img v-if="avatar" class="profile-img" :src="this.avatar" />
          <div v-else class="profile-img">
            <svg width="100%" height="35px" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="25" fill="#6c2a58" />
              <text
                dominant-baseline="middle"
                text-anchor="middle"
                font-size="15"
                fill="white"
                x="25"
                y="26"
              >
                {{
                  notification._embedded["yona:user"].firstName.charAt(0) +
                  notification._embedded["yona:user"].lastName.charAt(0)
                }}
              </text>
            </svg>
          </div>
          <p class="icon-title">
            {{ notification._embedded["yona:user"].firstName }}
            {{ notification._embedded["yona:user"].lastName }}
          </p>
          <p class="icon-text">
            {{ notification.nickname }}
          </p>
        </div>
      </div>
      <div class="tabs"></div>
    </div>
    <div class="wrapper">
      <div class="grey-bg-div">
        <p class="has-text-left">
          <strong>{{ $t("status_friend_request") }}</strong
          ><br /><br />
          <span class="light-text" v-if="notification.message">
            {{ notification.message }} <br /><br />
          </span>
          <span class="light-text">{{ $t("friend_request_content") }}</span
          ><br />
          <span class="light-text">{{
            notification._embedded["yona:user"].mobileNumber
          }}</span>
        </p>
        <a class="button reject is-rounded is-6" @click="reject()">{{
          $t("reject")
        }}</a>
        <a class="button accept is-rounded is-6" @click="accept()">{{
          $t("accept")
        }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "../../utils/axios/axios";
import { Prop } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  components: {},
})
export default class Notifications extends Vue {
  @Prop() notification!: any;
  avatar: string | null = "";
  @Action("getBuddies", { namespace: "buddies" }) getBuddies: any;

  async mounted() {
    if (this.notification && this.notification._links["yona:userPhoto"]) {
      let photo_response: any = await axios
        .get(this.notification._links["yona:userPhoto"].href, {
          responseType: "blob",
        })
        .catch();

      this.avatar = await URL.createObjectURL(photo_response.data);
    }
  }

  async accept() {
    let response: any = await axios
      .post(this.notification._links["yona:accept"].href, {
        properties: {
          message: "accepted",
        },
      })
      .catch();

    if (response.status == 200) {
      this.getBuddies();
      this.$router.push({ name: "Notifications" });
    }
  }
  async reject() {
    let response: any = await axios
      .post(this.notification._links["yona:reject"].href, {
        properties: {
          message: "rejected",
        },
      })
      .catch();

    if (response.status == 200) this.$router.push({ name: "Notifications" });
  }
}
</script>

<style lang="scss">
#friend-request {
  .wrapper {
    padding: 0;
    .profile-img {
      width: 75px;
      height: 75px;
      min-height: 75px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      background-color: rgba(255, 255, 255, 0.4);
      svg {
        height: 100%;
      }
    }
    .icon-text {
      margin-bottom: 55px;
    }
    .grey-bg-div {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 15px 25px 15px 25px;
      .light-text {
        opacity: 0.6;
      }
      .button {
        margin-top: 10px;
        border: none;
        color: #fff;
        width: 38%;
        padding: 6px 13px;
        &.accept {
          background-color: #95c11f;
        }
        &.reject {
          background-color: #e8308a;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
