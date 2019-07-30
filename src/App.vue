<template>
  <div id="app">
    <router-view />
    <transition name="fade">
      <div class="server-error-message" v-if="api.serverMessage">
        <p>
          {{ api.serverMessage }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
import { ApiState } from "@/store/api/types";

@Component({
  components: { ProfilePic }
})
export default class MeTabs extends Vue {
  @State("api") api!: ApiState;
}
</script>

<style lang="scss">
.server-error-message {
  display: block;
  position: fixed;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  width: 100%;
  max-height: 100px !important;
  z-index: 100;
  p {
    margin: 20px 0;
  }
}
.fade-enter-active {
  transition: max-height 2s;
  max-height: 100px !important;
}
.fade-enter {
  max-height: 0 !important;
}
.fade-leave {
  max-height: 100px !important;
}
.fade-leave-active {
  transition: max-height 2s;
  max-height: 0 !important;
}
</style>
