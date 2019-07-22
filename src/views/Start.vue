<template>
  <div>
    <router-link :to="{ name: 'Transparency' }">Start tour</router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

@Component({})
export default class Start extends Vue {
  //@Prop() msg: string = '';

  //Cycle hooks
  mounted() {}

  //Computed properties
  get computedMsg() {
    return "";
  }

  //Methods
  methodFunction() {}
}
</script>

<style lang="scss"></style>
