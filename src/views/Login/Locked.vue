<template>
  <div id="locked" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      INLOGGEN
    </div>
    <div class="wrapper">
      <img src="../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Je account is geblokkeerd
      </p>

      <p class="icon-text">
        Om veiligheidsredenen is je account geblokkeerd. Gebruik de ‘PIN reset’ knop hieronder om je account opnieuw te activeren.
      </p>
      <span class="button is-white is-rounded" @click="pinReset">PIN RESET</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import {Action, State} from "vuex-class";
  import {LinksState} from "../../store/links/types";
  import axios from "../../utils/axios/axios"
  import {toSeconds, parse} from 'iso8601-duration';
  import {LoginState} from "../../store/login/types";

  @Component({})
  export default class Locked extends Vue {
    @State('links') links!: LinksState;
    @State('login') login!: LoginState;
    @Action('setProperty', {namespace: 'login'}) setProperty: any;

    mounted () {
      let now = Math.trunc((new Date()).getTime() / 1000);

      if(this.login.locked_timer > now){ //Still waiting on the timer
        this.$router.push({'name': 'WaitLocked'});
      } else if(this.login.locked_timer > 0) { //Timer is over
        this.$router.push({'name': 'ValidateLocked'});
      }
    }

    async pinReset () {
      if(this.links.links["yona:requestPinReset"]) {
        let response = await axios.post(this.links.links["yona:requestPinReset"].href, {}
        ).catch((error) => {
          console.log(error)
        });

        if(response) {
          let date = new Date();
          let seconds = parseInt(date.getTime()/1000)
          seconds += toSeconds(parse(response.data.delay))

          this.setProperty({locked_timer: seconds})

          if (response.status === 200) {
            //Successfull
            this.$router.push({'name': 'WaitLocked'});
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  #locked{
    .button{
      box-sizing: border-box;
      margin-top:5px;
      padding:10px;
      height:auto;
      width:100%;
    }
  }
</style>