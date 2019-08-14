<template>
  <div id="read-notification" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("single_message") }}
      </div>
    </div>
    <div class="wrapper grey-bg">
      {{ notification.message }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ReadNotification extends Vue {
  @Prop() notification!: any;

  async mounted() {}
}
</script>

<style lang="scss">
@import "../../sass/variables";

#read-notification {
  .wrapper {
    padding: 30px;
    text-align: left;

    &.grey-bg {
      background-color: #f3f3f3;
    }
  }
}
</style>
