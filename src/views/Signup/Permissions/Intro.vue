<template>
  <div id="intro" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("join") }}
    </div>
    <div class="wrapper">
      <p class="icon-title">
        {{ $t("thanksforjoining") }}
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        {{ $t("getyonarunning") }}
      </p>
      <ul class="permissions-list">
        <li
          v-for="(permission, index) in account.permissions"
          v-show="!permission.disabled"
          :key="index"
          class="columns is-mobile"
        >
          <img
            class="column is-2"
            :src="
              require('@/assets/images/signup/permission/' + permission.icon)
            "
          />
          <p class="column">
            {{ $t(index) }}
          </p>
          <div class="column is-1">
            <img
              v-if="permission.is_allowed"
              class="check"
              :src="
                require('@/assets/images/signup/permission/icon_check_green.svg')
              "
            />
            <img
              v-else=""
              class="check not-allowed"
              :src="
                require('@/assets/images/signup/permission/icon_check_white.svg')
              "
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="is-centered bottom-aligned">
      <a class="button" @click="checkPermissions">{{ $t("next") }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Action, Getter, State } from "vuex-class";
import { AccountState } from "@/store/account/types";

@Component({})
export default class Intro extends Vue {
  @State("account") account!: AccountState;
  @Action("setPermission", { namespace: "account" }) setPermission: any;
  @Getter("hasAllPermissions", { namespace: "account" })
  hasAllPermissions!: boolean;

  async mounted() {
    //@ts-ignore
    const hasUsageAccess = await cordova.plugins.YonaServices.checkUsageAccess();

    if (hasUsageAccess === "true") {
      //@ts-ignore
      cordova.plugins.YonaServices.enable();

      this.setPermission({
        key: "tracking",
        value: true
      });
    }
  }

  checkPermissions() {
    if (this.hasAllPermissions) {
      this.$router.push({ name: "MeTimeLineDay" });
    } else {
      this.$router.push({ name: "GivePermission" });
    }
  }
}
</script>

<style lang="scss">
#intro {
  padding-bottom: 60px;
  .progress-bar {
    .progress {
      width: 100%;
    }
  }
  .permissions-list {
    margin-top: 60px;
    list-style: none;
    color: #fff;
    padding: 0;
    text-align: left;
    li {
      .column {
        display: inline-flex;
        align-items: center;
      }
      p {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 300;
      }
      img.not-allowed {
        opacity: 0.3;
      }
    }
  }
  .bottom-aligned {
    .button {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      border: 0;
    }
  }
}
</style>
