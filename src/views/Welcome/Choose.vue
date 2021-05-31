<template>
  <div id="choose">
    <img
      src="../../assets/images/welcome/choose/yona_logo.svg"
      @click="increaseCounter()"
    />

    <div class="field has-addons has-addons-centered" v-if="showInput">
      <div class="control">
        <input class="input" v-if="showInput" v-model="host" />
      </div>
      <div class="control">
        <button v-if="showInput" class="button is-info" @click="changeAPIUrl">
          Save
        </button>
      </div>
    </div>

    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{ name: 'Names' }">
        {{ $t("join") }}
      </router-link>
      <router-link class="button" :to="{ name: 'Login' }">
        {{ $t("login") }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action, State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";

@Component({})
export default class Choose extends Vue {
  @Action("setHost", { namespace: "api" }) setHost: any;
  @Action("setServerError", { namespace: "api" }) setServerError: any;
  @State("api") api!: ApiState;
  clickCounter: number = 0;
  showInput: boolean = false;
  host: string = "";
  response!: any;

  mounted() {
    this.host = this.api.host;
  }

  increaseCounter() {
    this.clickCounter++;

    if (this.clickCounter >= 6) {
      this.clickCounter = 0;
      let self = this;
      //@ts-ignore
      if (navigator && navigator.notification) {
        //@ts-ignore
        navigator.notification.prompt(
          "",
          async (result: any) => {
            if (result.buttonIndex === 1) {
              //Cancel
            } else if (result.buttonIndex === 2) {
              await this.changeAPIUrl(result.input1);
            }
          },
          self.$t("environment_alert_title"),
          [self.$t("cancel"), self.$t("save")],
          self.host
        );
      } else {
        this.showInput = true;
      }
    }
  }

  async changeAPIUrl(url: string) {
    let self = this;

    if (!url) {
      url = self.host;
    }

    let response: any = await axios
      .get(url + "/activityCategories/")
      .catch((error) => {
        if (error) {
          //@ts-ignore
          if (navigator && navigator.notification) {
            //@ts-ignore
            navigator.notification.alert(
              self.$t("environment_switch_error") + " " + self.api.host, // message
              () => {}, // callback
              self.$t("generic_alert_title"), // title
              "Close" // buttonName
            );
          } else {
            this.setServerError({
              serverMessage:
                self.$t("environment_switch_error") + " " + self.api.host,
            });
          }

          self.host = self.api.host;
        }
      });

    if (response) {
      self.host = url;

      //@ts-ignore
      if (navigator && navigator.notification) {
        //@ts-ignore
        navigator.notification.alert(
          self.$t("new_environment_switch_success_msg") + " " + self.host, // message
          () => {}, // callback
          self.$t("generic_alert_title"), // title
          "Close" // buttonName
        );
      } else {
        this.setServerError({
          serverMessage:
            self.$t("new_environment_switch_success_msg") + " " + self.host,
        });
      }

      this.setHost({
        host: self.host,
      });
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";
@import "../../sass/components/bottom-buttons";
#choose {
  text-align: center;
  img {
    display: block;
    padding-top: 30%;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
  .button {
    height: 100%;
    z-index: 10;
  }
}
</style>
