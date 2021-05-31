<template>
  <span>
    <router-view></router-view>
    <bottom-menu active_page="settings"></bottom-menu>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import BottomMenu from "@/components/BottomMenu.vue";

@Component({
  components: { BottomMenu },
})
export default class AbstractSettingsOverview extends Vue {}
</script>
<style lang="scss"></style>
