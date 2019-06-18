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
      {{buddies}}
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
      &.grey-bg{
        background-color:#f3f3f3;
      }
    }
  }
</style>