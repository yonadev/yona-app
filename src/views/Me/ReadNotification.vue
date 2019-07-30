<template>
  <div id="read-notification" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("single_message") }}
      </div>
    </div>
    <div class="wrapper grey-bg">
      <!--ToDo: Show the proper message instead of response (no response available atm so dont know what needs to be displayed)-->
      {{ notification }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    ProfilePic
  }
})
export default class ReadNotification extends Vue {
  @Prop() notification!: any;

  async mounted() {}
}
</script>

<style lang="scss">
@import "../../sass/variables";

#read-notification {
}
</style>
