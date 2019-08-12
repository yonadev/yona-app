<template>
  <div id="friends-profile" class="profile-template" :loading="loading">
    <div class="colored-background blue">
      <div class="heading">
        <div class="nav-title"></div>
        <div class="wrapper">
          <profile-pic
            class="profile-img"
            :src="buddyProfile._embedded['yona:user']._links.self.href"
          ></profile-pic>
          <p class="icon-title">{{ firstName }} {{ lastName }}</p>
          <p class="icon-text">
            {{ nickName }}
          </p>
        </div>
      </div>
      <div class="tabs is-fullwidth">
        <ul>
          <li :class="{ 'is-active': active_tab === 'profile' }">
            <a @click.prevent="active_tab = 'profile'">Profiel</a>
          </li>
          <li :class="{ 'is-active': active_tab === 'badges' }">
            <a @click.prevent="active_tab = 'badges'">Badges</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'profile'">
      <input-floating-label
        id="firstname"
        class="grey-bg-input"
        :label="$t('firstname')"
        type="text"
        :disabled="true"
        :value="firstName"
        icon="icn_name.svg"
      ></input-floating-label>
      <input-floating-label
        id="lastname"
        class="grey-bg-input"
        :label="$t('lastname')"
        type="text"
        :disabled="true"
        :value="lastName"
        icon="icn_name.svg"
      ></input-floating-label>
      <input-floating-label
        id="nickname"
        class="grey-bg-input"
        :label="$t('nickname')"
        type="text"
        :disabled="true"
        :value="nickName"
        icon="icn_nickname.svg"
      ></input-floating-label>
      <input-floating-label
        id="mobile"
        class="grey-bg-input"
        :label="$t('mobilenumber')"
        type="text"
        :disabled="true"
        :value="mobileNumber"
        icon="icn_mobile.svg"
      ></input-floating-label>
      <a class="button is-rounded remove-friend" @click="removeFriend">{{
        $t("remove_friend_btn")
      }}</a>
    </div>
    <div class="wrapper" v-if="active_tab === 'badges'"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";
import Component from "vue-class-component";
import axios from "@/utils/axios/axios";
import { Getter } from "vuex-class";
import { Buddy } from "@/store/buddies/types";
import { Prop } from "vue-property-decorator";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

@Component({
  components: {
    ProfilePic,
    InputFloatingLabel
  }
})
export default class FriendsProfile extends Vue {
  loading: boolean = false;
  active_tab: string | null = "profile";
  firstName: string | null = "";
  lastName: string | null = "";
  nickName: string | null = "";
  mobileNumber: string | null = "";
  @Prop() buddy_href!: string;

  @Getter("buddy", { namespace: "buddies" })
  public buddy!: (buddy_href: string) => Buddy;

  async mounted() {
    this.firstName = this.buddyProfile._embedded["yona:user"].firstName;
    this.lastName = this.buddyProfile._embedded["yona:user"].lastName;
    this.mobileNumber = this.buddyProfile._embedded["yona:user"].mobileNumber;
    this.nickName = this.buddyProfile._embedded["yona:user"].nickname;
  }

  get buddyProfile() {
    return this.buddy(this.buddy_href);
  }

  async removeFriend() {
    this.loading = true;
    const buddyProfile = this.buddy(this.buddy_href);
    await axios.delete(buddyProfile._links.edit.href);
    this.loading = false;
    this.$router.push({ name: "FriendsOverview" });
  }
}
</script>

<style lang="scss">
@import "../../../sass/variables";

#friends-profile {
  .profile-img {
    width: 75px;
    height: 75px;
    min-height: 75px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.4);
    img {
      height: 100%;
      border-radius: 50%;
    }
    svg {
      height: 100%;
    }
    span {
      display: block;
      color: #fff;
      font-size: 20px;
      padding: 25px 0;
    }
  }
  .nav-title {
    padding: 30px 15px 10px 15px;
  }
  .wrapper {
    padding: 0;
    &.grey-bg {
      background-color: #f3f3f3;
    }
    p.icon-text {
      margin-bottom: 10px;
    }
    .remove-friend {
      margin: 20px 0;
      border-color: $color-blue;
      color: $color-blue;
      background-color: transparent;
      width: 85%;
      padding: 5px 0;
      font-size: 14px;
    }
    .control {
      .input-floating-label.is-focused label {
        color: rgba(0, 0, 0, 0.4) !important;
      }
    }
  }
}
</style>
