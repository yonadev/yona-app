<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view />
    </transition>
    <transition name="server-message">
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
import { Watch } from "vue-property-decorator";

@Component({
  components: { ProfilePic },
})
export default class MeTabs extends Vue {
  @State("api") api!: ApiState;
  transitionName: string = "";

  @Watch("$route")
  routeChange(to: any, from: any) {
    this.transitionName = "fade";
  }
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
.server-message-enter-active {
  transition: max-height 2s;
  max-height: 100px !important;
}
.server-message-enter {
  max-height: 0 !important;
}
.server-message-leave {
  max-height: 100px !important;
}
.server-message-leave-active {
  transition: max-height 2s;
  max-height: 0 !important;
}
</style>
