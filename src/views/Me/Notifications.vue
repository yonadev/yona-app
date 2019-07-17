<template>
  <div id="notification" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        MELDINGEN
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div v-for="(notification, index) in notifications" :key="index" class="grey-bg-div notification" :class="{'is-not-read': !notification.isRead}">
        <div class="columns is-mobile" @click="goTo(notification)">
          <div class="column is-2">
            <div class="img-wrapper" v-if="notification && notification['@type'] === 'GoalConflictMessage'">
              <img :src="require('../../assets/images/avatars/adult_sad.svg')" />
            </div>
            <div v-else class="img-wrapper">
              <profile-pic v-if="getLink(notification)" :src="getLink(notification)"></profile-pic>
            </div>
          </div>
          <div class="column">
            <div v-if="notification && notification['@type'] === 'BuddyConnectRequestMessage'">
              <span class="is-block has-text-left title">
                <strong>Vriendenverzoek</strong>
              </span>
              <span class="is-block has-text-left name">
                {{notification._embedded['yona:user'].firstName}} {{notification._embedded['yona:user'].lastName}}
              </span>
            </div>
            <div v-else-if="notification && notification['@type'] === 'BuddyConnectResponseMessage'">
              <span class="is-block has-text-left title">
                <strong v-if="notification.status === 'REJECTED'">Vriendenverzoek afgewezen</strong>
                <strong v-else-if="notification.status === 'ACCEPTED'">Vriendenverzoek geaccepteerd</strong>
              </span>
                <span class="is-block has-text-left name">
                {{notification.nickname}}
              </span>
            </div>
            <div v-else-if="notification && notification['@type'] === 'BuddyDisconnectMessage'">
              <span class="is-block has-text-left title">
                <strong>Je bent verwijderd als vriend</strong>
              </span>
              <span class="is-block has-text-left name">
                {{notification.nickname}}
              </span>
            </div>
            <div v-else-if="notification && notification['@type'] === 'BuddyInfoChangeMessage'">
              BuddyInfoChangeMessage
            </div>
            <div v-else-if="notification && notification['@type'] === 'GoalConflictMessage'">
              <span class="is-block has-text-left title">
                <strong>NoGo alert</strong>
              </span>
              <span class="is-block has-text-left name">
                {{notification.nickname}}
              </span>
            </div>
          </div>
          <div class="column is-2" v-if="notification && notification['@type'] === 'BuddyConnectRequestMessage'">
            <div v-if="notification['@type'] === 'BuddyConnectRequestMessage'">
              <div class="img-wrapper">
                <img v-if="notification.status === 'ACCEPTED'" src="../../assets/images/icons/icn_accepted.svg"/>
                <img v-else-if="notification.status === 'REJECTED'" src="../../assets/images/icons/icn_rejected.svg"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {ApiState} from "@/store/api/types";
import axios from "@/utils/axios/axios"
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

@Component({
  components: {
    ProfilePic
  }
})
export default class Notifications extends Vue {
  @State('api') api!: ApiState;
  notifications: {} = {};

  async mounted () {
    if(this.api.links && this.api.links["yona:messages"]) {
      let response: any = await axios.get(this.api.links["yona:messages"].href
      ).catch((error) => {
        console.log(error)
      });

      if (response.data._embedded) {
        this.notifications = response.data._embedded['yona:messages']
      }
    }
  }

  getLink(notification: any){
    if(notification['@type'] === 'BuddyInfoChangeMessage'){
      return notification._links['yona:user'].href;
    } else if(notification['@type']  === 'BuddyConnectRequestMessage') {
      return notification._embedded['yona:user']._links.self.href;
    }
    return false;
  }

  async goTo(notification: any){
    if(!notification.isRead) {
      let read_response: any = await axios.post(notification._links['yona:markRead'].href, {
        "properties": {}
      }).catch((error) => {
        console.log(error)
      });
    }

    if(notification['@type'] === 'BuddyConnectRequestMessage' && notification.status === 'REQUESTED'){
      this.$router.push({name: 'FriendRequest', params: {notification: notification}});
    } else if (notification['@type'] === 'BuddyConnectResponseMessage') {
      this.$router.push({name: 'FriendsProfile', params: {buddy_link: notification._links['yona:buddy'].href}});
    }
  }
}
</script>

<style lang="scss">
  @import "../../sass/variables";

  #notification{
    .nav-title{
      padding:30px 15px 15px 30px;
    }
    .wrapper{
      padding:0;
      .grey-bg-div{
        background-image: linear-gradient(#f7f7f7, #fcfcfc);
        padding:15px 25px 15px 25px;
        &.is-not-read{
          background:#ecf2f8;
        }
      }
      .notification{
        .img-wrapper{
          width:50px;
          height:50px;
          -webkit-border-radius: 100%;
          -moz-border-radius: 100%;
          border-radius: 100%;
          overflow: hidden;
          position: relative;
          img{
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            text-align: center;
            z-index: 1;
            max-width:100%;
          }
          .profile-img{
            height:50px;
            width:50px;
            background-color:$color-purple-dark;
            color: #fff;
            position: relative;
            span{
              padding: 12px 0;
              position: relative;
              display: block;
              font-size:18px;
            }
          }
        }
        .title{
          margin-bottom:5px;
          margin-top:8px;
        }
        .name{
          opacity:0.6;
        }
      }
    }
  }
</style>