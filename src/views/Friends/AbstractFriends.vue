<template>
  <div>
    <router-view class="bottom-margin-menu"></router-view>
    <bottom-menu active_page="friends"></bottom-menu>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import BottomMenu from "@/components/BottomMenu.vue";
import { Action } from "vuex-class";

@Component({
  components: { BottomMenu },
})
export default class AbstractFriends extends Vue {
  @Action("getBuddies", { namespace: "buddies" }) getBuddies: any;
  mounted() {
    this.getBuddies();
  }
}
</script>
