<template>
  <div id="notification" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("message") }}
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div
        v-for="(day_notification, day_index) in all_notifications"
        :key="day_index"
      >
        <div class="top-label">
          <strong>{{
            getDayLabel(day_notification.date).toUpperCase()
          }}</strong>
        </div>
        <div
          v-for="(notification, index) in day_notification.notifications"
          :key="index"
          class="grey-bg-div notification"
          :class="{ 'is-not-read': !notification.isRead }"
        >
          <div class="columns is-mobile" @click="goTo(notification)">
            <div class="column is-2">
              <div
                class="img-wrapper"
                v-if="
                  notification &&
                    notification['@type'] === 'GoalConflictMessage'
                "
              >
                <img
                  :src="require('../../assets/images/avatars/adult_sad.svg')"
                />
              </div>
              <div v-else class="img-wrapper">
                <profile-pic
                  v-if="getLink(notification)"
                  :src="getLink(notification)"
                ></profile-pic>
              </div>
            </div>
            <div class="column">
              <div
                v-if="
                  notification &&
                    notification['@type'] === 'BuddyConnectRequestMessage'
                "
              >
                <span class="is-block has-text-left title">
                  <strong>{{ $t("buddyconnectrequested") }}</strong>
                </span>
                <span class="is-block has-text-left name">
                  {{ notification._embedded["yona:user"].firstName }}
                  {{ notification._embedded["yona:user"].lastName }}
                </span>
              </div>
              <div
                v-else-if="
                  notification &&
                    notification['@type'] === 'BuddyConnectResponseMessage'
                "
              >
                <span class="is-block has-text-left title">
                  <strong v-if="notification.status === 'REJECTED'">{{
                    $t("buddyresponserejected")
                  }}</strong>
                  <strong v-else-if="notification.status === 'ACCEPTED'">{{
                    $t("buddyresponseaccepted")
                  }}</strong>
                </span>
                <span class="is-block has-text-left name">
                  {{ notification.nickname }}
                </span>
              </div>
              <div
                v-else-if="
                  notification &&
                    notification['@type'] === 'BuddyDisconnectMessage'
                "
              >
                <span class="is-block has-text-left title">
                  <strong>{{
                    $t("buddydisconnectmessageuserromovedbuddy")
                  }}</strong>
                </span>
                <span class="is-block has-text-left name">
                  {{ notification.nickname }}
                </span>
              </div>
              <div
                v-else-if="
                  notification &&
                    notification['@type'] === 'BuddyInfoChangeMessage'
                "
              >
                <span class="is-block has-text-left title">
                  <strong>{{ $t("message_buddy_information_changed") }}</strong>
                </span>
                <span class="is-block has-text-left name">
                  {{ notification.nickname }}
                </span>
              </div>
              <div
                v-else-if="
                  notification &&
                    notification['@type'] === 'GoalConflictMessage'
                "
              >
                <span class="is-block has-text-left title">
                  <strong>{{ $t("nogoalert") }}</strong>
                </span>
                <span class="is-block has-text-left name">
                  {{ notification.nickname }}
                </span>
              </div>
            </div>
            <div
              class="column is-2"
              v-if="
                notification &&
                  notification['@type'] === 'BuddyConnectRequestMessage'
              "
            >
              <div
                v-if="notification['@type'] === 'BuddyConnectRequestMessage'"
              >
                <div class="img-wrapper">
                  <img
                    v-if="notification.status === 'ACCEPTED'"
                    src="../../assets/images/icons/icn_accepted.svg"
                  />
                  <img
                    v-else-if="notification.status === 'REJECTED'"
                    src="../../assets/images/icons/icn_rejected.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

interface Notification {
  creationTime: string;
  [key: string]: string;
}

@Component({
  components: {
    ProfilePic
  }
})
export default class Notifications extends Vue {
  @State("api") api!: ApiState;
  all_notifications: any = [];
  async mounted() {
    if (this.api.links && this.api.links["yona:messages"]) {
      let response: any = await axios
        .get(this.api.links["yona:messages"].href)
        .catch(error => {
          console.log(error);
        });

      if (response.data._embedded) {
        response.data._embedded["yona:messages"].forEach(
          (notification: Notification) => {
            let not = this.all_notifications.find((not: any) => {
              return this.getDayLabel(notification.creationTime) === not.date;
            });

            if (not) {
              not.notifications.push(notification);
            } else {
              this.all_notifications.push({
                date: this.getDayLabel(notification.creationTime),
                notifications: [notification]
              });
            }
          }
        );
      }
    }
  }

  getLink(notification: any) {
    if (notification["@type"] === "BuddyInfoChangeMessage") {
      return notification._links["yona:user"].href;
    } else if (notification["@type"] === "BuddyConnectRequestMessage") {
      return notification._embedded["yona:user"]._links.self.href;
    }
    return false;
  }

  async goTo(notification: any) {
    if (!notification.isRead) {
      let read_response: any = await axios
        .post(notification._links["yona:markRead"].href, {
          properties: {}
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (
      notification["@type"] === "BuddyConnectRequestMessage" &&
      notification.status === "REQUESTED"
    ) {
      this.$router.push({
        name: "FriendRequest",
        params: { notification: notification }
      });
    } else if (
      notification["@type"] === "BuddyInfoChangeMessage" ||
      notification["@type"] === "BuddyConnectResponseMessage"
    ) {
      this.$router.push({
        name: "FriendsProfile",
        params: { buddy_href: notification._links["yona:buddy"].href }
      });
    } else if (notification["@type"] === "GoalConflictMessage") {
      this.$router.push({
        name: "DetailedViewDay",
        params: { activity_link: notification._links["yona:dayDetails"].href }
      });
    }
  }

  getDayLabel(date: any) {
    let now = new Date();
    let date_obj = new Date(date);

    let date_locales: {
      [key: string]: {
        [key: string]: string[];
      };
    } = {
      nl: {
        days: [
          "ZONDAG",
          "MAANDAG",
          "DINSDAG",
          "WOENSDAG",
          "DONDERDAG",
          "VRIJDAG",
          "ZATERDAG"
        ],
        months: [
          "JANUARI",
          "FEBRUARI",
          "MAART",
          "APRIL",
          "MEI",
          "JUNI",
          "JULI",
          "AUGUSTUS",
          "SEPTEMBER",
          "OKTOBER",
          "NOVEMBER",
          "DECEMBER"
        ]
      },
      en: {
        days: [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY"
        ],
        months: [
          "JANUARY",
          "FEBRUARY",
          "MARCH",
          "APRIL",
          "MAY",
          "JUNE",
          "JULY",
          "AUGUST",
          "SEPTEMBER",
          "OCTOBER",
          "NOVEMBER",
          "DECEMBER"
        ]
      }
    };

    if (now.getDate() === date_obj.getDate()) date = this.$t("today");
    else if (now.getDate() - 1 === date_obj.getDate())
      date = this.$t("yesterday");
    else
      date =
        date_locales[this.$i18n.locale].days[date_obj.getDay()] +
        ", " +
        date_obj.getDate() +
        " " +
        date_locales[this.$i18n.locale].months[date_obj.getMonth()];

    return date;
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";

#notification {
  .nav-title {
    padding: 30px 15px 15px 30px;
  }
  .top-label {
    background: #e7e7e7;
    padding: 17px;
    font-size: 11px;
    opacity: 0.6;
    border-bottom: 1px solid #d5d5d5;
    border-top: 1px solid #d5d5d5;
  }
  .wrapper {
    padding: 0;
    .grey-bg-div {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 15px 25px 15px 25px;
      &.is-not-read {
        background: #ecf2f8;
      }
    }
    .notification {
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
      .name {
        opacity: 0.6;
      }
    }
  }
}
</style>
