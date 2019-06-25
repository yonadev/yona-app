<template>
  <div id="locked" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      INLOGGEN
    </div>
    <div class="wrapper">
      <img src="../../assets/images/signup/account/icn_secure.svg"/>
      <p class="icon-title">
        Je moet even wachten
      </p>
      <p class="icon-text">
        Om veiligheidsredenen is je account geblokkeerd. Activeren kan 24 uur nadat je een nieuwe PIN code hebt aangevraagd.
      </p>
      <timer :time="login.locked_timer"></timer>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import Timer from '../../components/Timer.vue';
  import { State} from "vuex-class";
  import {LoginState} from "../../store/login/types";

  @Component({
    components:{
      Timer
    }
  })
  export default class WaitLocked extends Vue {
    @State('login') login!: LoginState;

    async mounted () {
      let isLocked = window.setInterval(() => {
        let now = Math.trunc((new Date()).getTime() / 1000);

        //Locktime expired go to validate screen
        if(this.login.locked_timer && now > this.login.locked_timer){
          this.$router.push({'name': 'ValidateLocked'});
          clearInterval(isLocked)
        }
      },1000);
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