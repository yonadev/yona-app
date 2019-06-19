<template>
  <div id="friends-timeline" class="header-template">
    <div class="colored-background blue">
      <div class="nav-title">
        VRIENDEN
        <router-link :to="{'name': 'FriendAdd'}">
          <img class="icon-img is-pulled-right" src="../../assets/images/icons/icn_add.svg"/>
        </router-link>
      </div>
      <div class="tabs is-fullwidth">
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
      <div class="grey-bg-div" v-for="(buddy, index) in buddies" :key="index">
        <div class="columns is-mobile">
          <div class="column is-2">
            <div class="img-wrapper">
              <img :ref="'image'+index" :src="getPhoto(buddy._embedded['yona:user']._links['yona:userPhoto'].href, 'image'+index)" />
            </div>
          </div>
          <div class="column">
            <span class="is-block has-text-left title">
              <strong>{{buddy._embedded['yona:user'].firstName}} {{buddy._embedded['yona:user'].lastName}}</strong>
            </span>
            <span class="is-block has-text-left date">
              {{buddy._embedded['yona:user'].appLastOpenedDate}}
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
  import {LinksState} from "../../store/links/types";
  import axios from "../../utils/axios/axios"

  @Component({})
  export default class TimeLine extends Vue {
    @State('links') links!: LinksState;
    buddies: {} = {};
    active_tab: string = 'timeline';

    async mounted () {
      let response: any = await axios.get(this.links.links['yona:dailyActivityReportsWithBuddies'].href).catch((error) => {
        console.log(error)
      });

      console.log(response)

      let buddies_response: any = await axios.get(this.links.embedded['yona:buddies']._links.self.href).catch((error) => {
        console.log(error)
      });

      if(buddies_response.data._embedded)
        this.buddies = buddies_response.data._embedded['yona:buddies'];
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
  #friends-timeline{
    .small-profile-img{
      vertical-align: middle;
      top: -2px;
      width:30px;
      height:30px;
      border-radius: 50%;
      position:relative;
      background-color:#000;
      margin-right: 20px;
    }
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
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