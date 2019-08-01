<template>
  <div id="unsubscribe" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("deleteuser") }}
      </div>
    </div>
    <div class="wrapper">
      <p>
        {{ $t("deleteusermessage") }}
      </p>

      <a class="button is-rounded unsubscribe-button" @click="unsubscribe">{{
        $t("deleteuser")
      }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Mutation } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";

@Component({})
export default class Unsubscribe extends Vue {
  @State("api") api!: ApiState;
  @Mutation("resetAll") resetAll: any;

  async unsubscribe() {
    if (this.api.links) {
      //@ts-ignore
      if (typeof cordova.plugins !== undefined && cordova.plugins.firebase) {
        //@ts-ignore
        await cordova.plugins.firebase.messaging.revokeToken();
      }

      let delete_response: any = await axios
        .delete(this.api.links["edit"].href)
        .catch((error: any) => {
          console.log(error);
        });

      this.resetAll();

      this.$router.push({ name: "Tour" });
    }
  }
}
</script>

<style lang="scss">
@import "../../../sass/variables";

#unsubscribe {
  position: relative;
  .nav-title {
    padding: 30px 15px 15px 30px;
  }

  .unsubscribe-button {
    position: relative;
    width: 65%;
    margin: 20px 0;
    border-color: $color-yellow;
    color: $color-yellow;
    background-color: transparent;
    padding: 5px 40px;
    font-size: 14px;
  }
}
</style>
