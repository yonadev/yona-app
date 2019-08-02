<template>
  <div id="settings" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("devices") }}
      </div>
    </div>
    <div class="wrapper">
      <router-link :to="{ name: 'SettingsAddDevice' }">
        <div class="grey-bg-button">
          <strong>{{ $t("adddevice") }}</strong>
        </div>
      </router-link>
      <div v-for="(device, index) in devices" :key="index">
        {{ device }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";

@Component({})
export default class Devices extends Vue {
  @State("api") api!: ApiState;
  devices: [] = [];

  mounted() {
    console.log(this.api);
  }
}
</script>

<style lang="scss">
#settings {
  .nav-title {
    padding: 30px 15px 15px 30px;
  }
  .wrapper {
    padding: 0;
    .grey-bg-button {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 20px 25px 20px 25px;
      text-align: left;
    }
  }
}
</style>
