<template>
  <div id="login" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      INLOGGEN
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../assets/images/login/icn_y.png"/>
      <p class="icon-title">
        You are not alone
      </p>
      <pin-code :pincode.sync="password" :length="length"></pin-code>
      <router-link :to="{'name': 'WaitLocked'}">
        <p class="reset">
          PIN reset
        </p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Watch, Component } from 'vue-property-decorator';
import PinCode from '../../components/PinCode.vue';

@Component({
  components:{
    PinCode
  }
})
export default class Login extends Vue {
  password: number | null = null;
  length: number = 4;

  @Watch('password')
  onChildChanged(val: string) {
    if(val && val.toString().length === this.length) {
      if (val === "1234")
        this.$router.push({'name': 'Intro'});
      else
        this.$router.push({'name': 'Locked'});
    }
  }
}
</script>

<style lang="scss"></style>