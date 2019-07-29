<template>
  <div id="choose">
    <img src="../../assets/images/welcome/choose/yona_logo.svg" @click="clickCounter++" />

    <br/>
    <br/>
    <input v-if="clickCounter >= 6" v-model="host" />
    <button v-if="clickCounter >= 6" class="button" @click="changeAPIUrl">Save</button>

    <!--ToDo: Make it like a native or cordova popup-->

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
import {Action, State} from "vuex-class";
import {ApiState} from "@/store/api/types";

@Component({})
export default class Choose extends Vue {
  @Action("setHost", { namespace: "api" }) setHost: any;
  @State("api") api!: ApiState;
  clickCounter: number = 0;
  host: string = '';

  mounted () {
    this.host = this.api.host;
  }

  changeAPIUrl(){
    this.setHost({
      host: this.host
    });
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
}
</style>
