<template>
  <div class="bottom-margin-menu">
    <router-view :key="$route.fullPath"></router-view>
    <bottom-menu active_page="profile"></bottom-menu>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import BottomMenu from "@/components/BottomMenu.vue";

@Component({
  components: { BottomMenu },
})
export default class AbstractMe extends Vue {}
</script>

<style scoped lang="scss"></style>
