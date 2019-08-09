<template>
  <div id="settings" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("devices") }}
      </div>
    </div>
    <div class="wrapper">
      <div
        v-for="(device, index) in api.embedded['yona:devices']._embedded[
          'yona:devices'
        ]"
        :key="index"
        class="grey-bg-button"
      >
        <router-link :to="{ name: 'ViewDevice', params: { device: device } }">
          <strong>{{ device.name }} </strong>
          <span v-if="device.requestingDevice">
            ({{ $t("currentdevice") }})</span
          ><br />
          <p>{{ device.appLastOpenedDate }}</p>
        </router-link>
      </div>
      <router-link :to="{ name: 'SettingsAddDevice' }">
        <div class="grey-bg-button">
          <strong>{{ $t("adddevice") }}</strong>
        </div>
      </router-link>
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

  mounted() {}
}
</script>

<style lang="scss">
#settings {
  .nav-title {
    padding: 30px 15px 15px 25px;
  }
  .wrapper {
    padding: 0;
    .grey-bg-button {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 20px 25px 20px 25px;
      text-align: left;
      span {
        opacity: 0.6;
      }
      p {
        margin: 5px 0 0;
        opacity: 0.6;
      }
    }
  }
}
</style>
