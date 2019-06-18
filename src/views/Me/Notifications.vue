<template>
  <div id="notification" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        MELDINGEN
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div class="grey-bg-div notification" v-for="(notification, index) in notifications" :key="index" :class="{'is-not-read': !notification.isRead}">
        <router-link class="columns is-mobile" :to="{name: 'FriendRequest', params: {notification: notification}}" v-if="notification && notification['@type'] === 'BuddyConnectRequestMessage'">
          <div class="column is-2">
            <div class="img-wrapper">
              <img :ref="'image'+index" :src="getPhoto(notification._links['yona:userPhoto'].href, 'image'+index)" />
            </div>
          </div>
          <div class="column">
            <span class="is-block has-text-left title">
              <strong>Vriendenverzoek</strong>
            </span>
            <span class="is-block has-text-left name">
              {{notification._embedded['yona:user'].firstName}} {{notification._embedded['yona:user'].lastName}}
          </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {LinksState} from "../../store/links/types";
import axios from "../../utils/axios/axios"

@Component({})
export default class Notifications extends Vue {
  @State('links') links!: LinksState;
  notifications: {} = {};

  async mounted () {
    let response = await axios.get(this.links.links["yona:messages"].href
    ).catch((error) => {
      console.log(error)
    });

    if(response.data._embedded) {
      this.notifications = response.data._embedded['yona:messages']
    }
  }

  async getPhoto(href, index){
    let photo_response: any = await axios.get(href, {
      responseType: 'blob'
    }).catch((error) => {
      console.log(error)
    });

    this.$refs[index][0].src = await URL.createObjectURL(photo_response.data)
  }
}
</script>

<style lang="scss">
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
            text-align: center;
            z-index: 1;
            max-width:100%;
          }
        }
        .title{
          margin-bottom:5px;
          margin-top:10px;
        }
        .name{
          opacity:0.6;
        }
      }
    }
  }
</style>