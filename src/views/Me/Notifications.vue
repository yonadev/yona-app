<template>
  <div id="notification" class="header-template" :loading="loading">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("message") }}
      </div>
    </div>

    <div class="wrapper grey-bg">
      <div
        v-for="(day_notification, day_index) in all_notifications"
        :key="'day' + day_index"
      >
        <div class="top-label">
          <strong>{{ day_notification.date.toUpperCase() }}</strong>
        </div>
        <div
          v-for="(notification, index) in day_notification.notifications"
          :key="'not' + index"
          class="grey-bg-div notification"
          :class="{ 'is-not-read': !notification.isRead }"
        >
          <swipe-out :ref="'list' + day_index + index">
            <template v-slot>
              <div
                v-if="notification"
                class="columns is-mobile"
                @click="goTo(notification)"
              >
                <div class="column is-2">
                  <div
                    class="img-wrapper"
                    v-if="
                      notification &&
                        notification['@type'] === 'GoalConflictMessage'
                    "
                  >
                    <img
                      :src="
                        require('../../assets/images/avatars/adult_sad.svg')
                      "
                    />
                  </div>
                  <div v-else class="img-wrapper">
                    <profile-pic
                      v-if="getPicLink(notification)"
                      :src="getPicLink(notification)"
                    ></profile-pic>
                    <profile-pic
                      v-else-if="getPicData(notification)"
                      :data="getPicData(notification)"
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
                      <strong>{{
                        $t("message_buddy_information_changed")
                      }}</strong>
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
                  <div
                    v-else-if="
                      notification &&
                        notification['@type'] === 'ActivityCommentMessage'
                    "
                  >
                    <span class="is-block has-text-left title">
                      <strong>{{ $t("comment") }}</strong>
                    </span>
                    <span class="is-block has-text-left name">
                      {{ notification.nickname }}
                    </span>
                  </div>
                  <div
                    v-else-if="
                      notification && notification['@type'] === 'SystemMessage'
                    "
                  >
                    <span class="is-block has-text-left title">
                      <strong>{{ $t("system_message") }}</strong>
                    </span>
                    <span class="is-block has-text-left name">
                      {{ notification.nickname }}
                    </span>
                  </div>
                  <div
                    v-else-if="
                      notification &&
                        notification['@type'] === 'GoalChangeMessage'
                    "
                  >
                    <span class="is-block has-text-left title">
                      <strong>{{ $t("goalchanged") }}</strong>
                    </span>
                    <span class="is-block has-text-left name">
                      {{ notification.nickname }}
                    </span>
                  </div>
                  <div
                    v-else-if="
                      notification &&
                        notification['@type'] === 'BuddyDeviceChangeMessage'
                    "
                  >
                    <span class="is-block has-text-left title">
                      <strong>{{ $t("deviceadded") }}</strong>
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
                    v-if="
                      notification['@type'] === 'BuddyConnectRequestMessage'
                    "
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
            </template>
            <template v-slot:right>
              <div class="item-delete">
                <a @click="deleteNotification(day_index, index, notification)">
                  <img :src="require('@/assets/images/icons/icn_trash.svg')" />
                </a>
              </div>
            </template>
          </swipe-out>
        </div>
      </div>
      <div
        class="infinite-scroll"
        v-observe-visibility="
          (isVisible, entry) =>
            this.getNotifications(isVisible, entry, nextNotifications)
        "
      ></div>
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

//@ts-ignore
import { SwipeList, SwipeOut } from "vue-swipe-actions";

interface Notification {
  creationTime: string;
  [key: string]: string;
}

@Component({
  components: {
    ProfilePic,
    SwipeList,
    SwipeOut
  }
})
export default class Notifications extends Vue {
  @State("api") api!: ApiState;
  all_notifications: any = [];
  gettingNotifications: boolean = false;
  nextNotifications: string = "";
  loading: boolean = false;

  async mounted() {
    if (this.api.links && this.api.links["yona:messages"]) {
      await this.getNotifications(
        true,
        true,
        this.api.links["yona:messages"].href
      );
    }
  }

  async deleteNotification(
    day_index: number,
    index: number,
    notification: any
  ) {
    this.loading = true;

    let notification_deleted: any = await axios
      .delete(notification._links.edit.href)
      .catch(error => {
        console.log(error);
      });

    this.loading = false;

    if (notification_deleted) {
      this.all_notifications[day_index].notifications = this.all_notifications[
        day_index
      ].notifications.filter((i: any) => i !== notification);
      //@ts-ignore
      this.$refs["list" + day_index + index][0].closeActions();
    }
  }

  async getNotifications(isVisible: boolean, entry: any, href: string) {
    if (isVisible && !this.gettingNotifications && !this.loading) {
      this.loading = true;
      if (href) {
        let self = this;
        this.gettingNotifications = true;

        let messages: any = await axios.get(href).catch(error => {
          console.log(error);
        });

        this.loading = false;

        if (messages) {
          if (messages.data._links.next) {
            this.nextNotifications = messages.data._links.next.href;
            this.gettingNotifications = false;
          } else {
            this.nextNotifications = "";
          }

          if (messages.data._embedded) {
            messages.data._embedded["yona:messages"].forEach(
              (notification: Notification) => {
                let not = self.all_notifications.find((not: any) => {
                  return (
                    this.getDayLabel(notification.creationTime) === not.date
                  );
                });

                if (not) {
                  not.notifications.push(notification);
                } else {
                  self.all_notifications.push({
                    date: this.getDayLabel(notification.creationTime),
                    notifications: [notification]
                  });
                }
              }
            );
          }
        }
      }
    }
  }

  getPicLink(notification: any) {
    if (
      (notification && notification["@type"] === "BuddyInfoChangeMessage") ||
      notification["@type"] === "ActivityCommentMessage" ||
      notification["@type"] === "GoalChangeMessage" ||
      (notification["@type"] === "BuddyConnectResponseMessage" &&
        notification._links["yona:userPhoto"]) ||
      notification["@type"] === "BuddyDeviceChangeMessage"
    ) {
      return notification._links["yona:user"].href;
    }

    return false;
  }

  getPicData(notification: any) {
    if (notification["@type"] === "BuddyConnectRequestMessage") {
      return {
        type: "buddy",
        text: notification.nickname
      };
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
    } else if (notification["@type"] === "ActivityCommentMessage") {
      this.loading = true;

      if (notification._links["yona:weekDetails"]) {
        let weekDetails: any = await axios
          .get(notification._links["yona:weekDetails"].href)
          .catch(error => {
            console.log(error);
          });

        if (weekDetails && weekDetails.data._links["yona:buddy"]) {
          this.$router.push({
            name: "DetailedViewWeek",
            params: {
              buddy_href: notification._links["yona:buddy"].href,
              activity_link: notification._links["yona:weekDetails"].href,
              thread: notification
            }
          });
        } else {
          this.$router.push({
            name: "DetailedViewWeek",
            params: {
              activity_link: notification._links["yona:weekDetails"].href,
              thread: notification
            }
          });
        }
      } else if (notification._links["yona:dayDetails"]) {
        let dayDetails: any = await axios
          .get(notification._links["yona:dayDetails"].href)
          .catch(error => {
            console.log(error);
          });

        if (dayDetails && dayDetails.data._links["yona:buddy"]) {
          this.$router.push({
            name: "DetailedViewDay",
            params: {
              buddy_href: notification._links["yona:buddy"].href,
              activity_link: notification._links["yona:dayDetails"].href,
              thread: notification
            }
          });
        } else {
          this.$router.push({
            name: "DetailedViewDay",
            params: {
              activity_link: notification._links["yona:dayDetails"].href,
              thread: notification
            }
          });
        }
      }
    } else if (notification["@type"] === "SystemMessage") {
      this.$router.push({
        name: "ReadNotification",
        params: { notification: notification }
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
  height: 100%;
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

      .swipeout-content {
        padding: 15px 25px 15px 25px;
      }

      .swipeout-right {
        width: 25%;
        .item-delete {
          text-align: center;
          background-color: $color-purple;
          width: 100%;
          a {
            display: block;

            img {
              color: #f3f3f3;
              width: 24px;
              margin-top: 27px;
            }
          }
        }
      }
    }
  }
}
</style>
