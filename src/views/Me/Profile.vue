<template>
  <div id="profile" class="colored-background purple-dark profile-template">
    <div class="heading" v-if="page === 'profile'">
      <div class="nav-title" v-if="edit">
        ACCOUNT BEWERKEN
        <img class="nav-icon" src="../../assets/images/signup/permission/icon_check_white.svg" alt="icn_edit" @click="switchMode">
      </div>

      <div class="nav-title" v-else="">
        <img class="nav-icon" src="../../assets/images/profile/icn_edit.svg" alt="icn_edit" @click="switchMode">
      </div>

      <div class="wrapper">
        <img class="profile-img" :src="require('../../assets/images/users/' + profilePic )" />
        <p class="icon-title">
          {{name}}
        </p>
        <p class="icon-text">
          {{nickname}}
        </p>
      </div>
    </div>

    <div class="heading badges" v-else="">
      <div class="nav-title"></div>
      <div class="wrapper">
        <img class="profile-img" :src="'../../assets/images/users/' + profilePic "/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'

@Component({})
export default class Profile extends Vue {
    private edit: boolean = false;
    private page: string = 'profile';
    name: string = 'Maria Schuurman';
    nickname: string = 'Mamaria';
    profilePic: string = 'maria1.jpg';
    mobile: string = '';

    //Cycle hooks
    mounted () {
    }

    //Computed properties
    get computedMsg () {
        return '';
    }

    //Methods
    switchMode () {
      this.edit = !(this.edit != false)
    }
}
</script>

<style lang="scss">

</style>