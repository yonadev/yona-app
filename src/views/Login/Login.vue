<template>
  <div id="login" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      INLOGGEN
    </div>
    <div class="wrapper">
      <img src="../../assets/images/login/icn_y.png"/>
      <p class="icon-title">
        You are not alone
      </p>
      <pin-code v-model="password" :length="4"></pin-code>
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
  private password: number = 0

  @Watch('password')
  onChildChanged(val: string) {
    if(val === "1111")
      this.$router.push({'name': 'Locked'});
    else if(val === "0000")
      this.$router.push({'name': 'Locked'});
  }
}
</script>

<style lang="scss"></style>