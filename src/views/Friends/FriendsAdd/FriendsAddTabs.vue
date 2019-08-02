<template>
  <div id="friends-tabs" class="header-template" :loading="loading">
    <div class="colored-background blue">
      <div class="nav-title">
        {{ $t("add_friend") }}
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <router-link
            tag="li"
            :to="{ name: 'FriendsAddManual' }"
            active-class="is-active"
          >
            <a>{{ $t("addfriendmanually") }}</a>
          </router-link>
          <router-link
            tag="li"
            :to="{ name: 'FriendsAddAddressBook' }"
            active-class="is-active"
          >
            <a>{{ $t("addfriendcontacts") }}</a>
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

@Component({
  components: {}
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
#friends-tabs {
  .nav-title {
    padding: 30px 15px 10px 15px;
  }
}
</style>
