<template>
  <div id="notification" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        MELDINGEN
      </div>
    </div>
    <div class="wrapper grey-bg">
      Meldingen
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {LinksState} from "../../store/links/types";
import axios from "../../utils/axios/axios"

@Component({})
export default class Notifications extends Vue {
  @State('links') links!: LinksState;

  async mounted () {
    console.log(this.links.links)
    let response = await axios.get(this.links.links["yona:messages"].href
    ).catch((error) => {
      console.log(error)
    });

    console.log(response)
  }
}
</script>

<style lang="scss">
</style>