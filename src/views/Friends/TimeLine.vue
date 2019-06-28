<template>
  <div id="friends-timeline" class="header-template">
    <div class="colored-background blue">
      <div class="nav-title">
        VRIENDEN
        <router-link :to="{'name': 'FriendAdd'}">
          <img class="icon-img is-pulled-right" src="../../assets/images/icons/icn_add.svg"/>
        </router-link>
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <li :class="{'is-active': active_tab === 'timeline'}">
            <a @click.prevent="active_tab = 'timeline'">Timeline</a>
          </li>
          <li :class="{'is-active': active_tab === 'overview'}">
            <a @click.prevent="active_tab = 'overview'">Overzicht</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'timeline'">
      Tijdlijn
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'overview'">
      <div class="top-label">
        <strong>VERBONDEN</strong>
      </div>
      <div v-for="(buddy, index) in buddies" :key="'accepted'+index" :class="{'grey-bg-div': buddy && buddy.receivingStatus === 'ACCEPTED'}">
        <div v-if="buddy && buddy.receivingStatus === 'ACCEPTED'" class="columns is-mobile">
          <div class="column is-2">
            <div class="img-wrapper">
              <img v-if="buddy._embedded['yona:user']._links['yona:userPhoto']" :ref="'image'+index" :src="getPhoto(buddy._embedded['yona:user']._links['yona:userPhoto'].href, 'image'+index)" />
              <div v-else class="profile-img">
                <span>
                  {{buddy._embedded['yona:user'].firstName.charAt(0)}}{{buddy._embedded['yona:user'].lastName.charAt(0)}}
                </span>
              </div>
            </div>
          </div>
          <div class="column">
            <span class="is-block has-text-left title">
              <strong>{{buddy._embedded['yona:user'].firstName}} {{buddy._embedded['yona:user'].lastName}}</strong>
            </span>
            <span class="is-block has-text-left date">
              Laatst gezien: {{buddy._embedded['yona:user'].appLastOpenedDate}}
            </span>
          </div>
        </div>
      </div>
      <div class="top-label">
        <strong>VERZOEKEN</strong>
      </div>
      <div v-for="(buddy, index) in buddies" :key="'requested'+index" :class="{'grey-bg-div': buddy && buddy.receivingStatus === 'REQUESTED'}">
        <div v-if="buddy && buddy.receivingStatus === 'REQUESTED'" class="columns is-mobile">
          <div class="column is-2">
            <div class="img-wrapper">
              <div class="img-placeholder"></div>
            </div>
          </div>
          <div class="column">
            <span class="is-block has-text-left title">
              <strong>{{buddy._embedded['yona:user'].firstName}} {{buddy._embedded['yona:user'].lastName}}</strong>
            </span>
            <span class="is-block has-text-left date">
              Heeft nog niet geaccepteerd
            </span>
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

  @Component({})
  export default class TimeLine extends Vue {
    @State('api') api!: ApiState;
    buddies: {} = {};
    active_tab: string = 'timeline';

    async mounted () {
      if(this.api.links && this.api.links['yona:dailyActivityReportsWithBuddies']) {
        let response: any = await axios.get(this.api.links['yona:dailyActivityReportsWithBuddies'].href).catch((error) => {
          console.log(error)
        });

        if(this.api.embedded && this.api.embedded['yona:buddies']) {
          let buddies_response: any = await axios.get(this.api.embedded['yona:buddies']._links.self.href).catch((error) => {
            console.log(error)
          });

          if (buddies_response.data._embedded)
            this.buddies = buddies_response.data._embedded['yona:buddies'];
        }
      }
    }

    async getPhoto(href: any, index: any){
      let photo_response: any = await axios.get(href, {
        responseType: 'blob'
      }).catch((error) => {
        console.log(error)
      });

      (this.$refs[index] as any)[0].src = await URL.createObjectURL(photo_response.data)
    }

  }
</script>

<style lang="scss">
  @import "../../sass/variables";

  #friends-timeline{
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
      }
      .top-label{
        background:#e7e7e7;
        padding: 17px;
        font-size: 11px;
        opacity: 0.6;
        border-bottom:1px solid #d5d5d5;
      }
      .grey-bg-div{
        background-image: linear-gradient(#f7f7f7, #fcfcfc);
        padding:15px 25px 15px 25px;
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
          .img-placeholder{
            width:100%;
            height:100%;
            background-color:$color-purple-dark;
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
        .date{
          opacity:0.6;
        }
      }
    }
  }
</style>