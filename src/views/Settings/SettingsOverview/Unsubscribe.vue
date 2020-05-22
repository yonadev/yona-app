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

      <a class="button is-rounded unsubscribe-button" @click="unsubscribe" :disabled="loading">{{
        $t("deleteuser")
      }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Action } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";

@Component({})
export default class Unsubscribe extends Vue {
  @State("api") api!: ApiState;
  @Action("resetAll") resetAll: any;
  loading: boolean = false;

  async unsubscribe() {
    if (this.api.links && !this.loading) {
      this.loading = true;
      let delete_response: any = await axios
        .delete(this.api.links["edit"].href)
        .catch();

      await this.resetAll();
      this.loading = false;
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
    font-size: 1.2rem;
  }
}
</style>
