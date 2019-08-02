<template>
  <div id="friends-tabs" class="header-template" :loading="loading">
    <div class="colored-background blue">
      <div class="nav-title">
        {{ $t("friends") }}
        <router-link :to="{ name: 'FriendsAddManual' }">
          <img
            class="icon-img is-pulled-right"
            src="../../assets/images/icons/icn_add.svg"
          />
        </router-link>
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <router-link
            tag="li"
            :to="{ name: 'FriendsTimeLine' }"
            active-class="is-active"
          >
            <a>{{ $t("timeline") }}</a>
          </router-link>
          <router-link
            tag="li"
            :to="{ name: 'FriendsOverview' }"
            active-class="is-active"
          >
            <a>{{ $t("overview") }}</a>
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
import Component from "vue-class-component";
import { Action } from "vuex-class";
import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";

@Component({
  components: {
    UiControlsLabel
  }
})
export default class FriendsTabs extends Vue {
  @Action("update", { namespace: "buddies" }) update: any;
  loading: boolean = false;

  async mounted() {
    this.loading = true;
    await this.update();
    this.loading = false;
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";

#friends-tabs {
  .nav-title {
    padding: 30px 15px 10px 15px;
  }
  .wrapper {
    padding: 0;
    &.grey-bg {
      background-color: #f3f3f3;
    }
    .top-label {
      background: #e7e7e7;
      padding: 17px;
      font-size: 11px;
      opacity: 0.6;
      border-bottom: 1px solid #d5d5d5;
    }
    .grey-bg-div {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 15px 25px 15px 25px;
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
        .img-placeholder {
          width: 100%;
          height: 100%;
          background-color: $color-purple-dark;
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
      .date {
        opacity: 0.6;
      }
    }
  }
}
</style>
