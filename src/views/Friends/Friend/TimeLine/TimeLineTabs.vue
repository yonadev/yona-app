<template>
  <div id="me" class="header-template">
    <div class="colored-background blue">
      <div class="nav-title">
        <router-link :to="{name: 'FriendsProfile', params: {buddy_href}}">
          <profile-pic class="profile-img" :src="buddyProfile._embedded['yona:user']._links.self.href"></profile-pic>
          <span class="dashboard-title">{{$t('dashboard')}}</span>
        </router-link>
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <router-link tag="li" :to="{name: 'FriendTimeLineDay'}" active-class="is-active">
            <a>{{$t('perday')}}</a>
          </router-link>
          <router-link tag="li" :to="{name: 'FriendTimeLineWeek'}" active-class="is-active">
            <a>{{$t('perweek')}}</a>
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
    import Vue from 'vue'
    import {Getter, State} from "vuex-class";
    import {AccountState} from "@/store/account/types";
    import Component from "vue-class-component";
    import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
    import {Buddy} from "@/store/buddies/types";
    import {Prop} from "vue-property-decorator";

    @Component({
      components: {ProfilePic}
    })
    export default class FriendTimeLineTabs extends Vue {
        @Prop() buddy_href!: string;

        @Getter('buddy', {namespace: 'buddies'})
        public buddy!: (buddy_href: string) => Buddy;

        get buddyProfile(){
          return this.buddy(this.buddy_href);
        }

    }
</script>

<style lang="scss">
  #me{
    .profile-img {
      img {
        width: 30px;
        height: 30px;
        background-color: #915C80;
        margin-right: 20px;
        display: inline-block;
        border-radius:50%;
      }
    }
    .small-top-icon{
      vertical-align: middle;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      position: relative;
    }
    .dashboard-title{
      display:inline-block;
      vertical-align: top;
      height:30px;
      line-height:30px;
    }
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
      }
    }
  }
</style>