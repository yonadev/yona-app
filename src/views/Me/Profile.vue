<template>
  <div id="profile" class="profile-template">
    <div class="colored-background purple-dark">
      <div class="heading">
        <div class="nav-title" v-if="active_tab === 'badges'"></div>
        <div class="nav-title" v-if="active_tab === 'profile'">
          <span v-if="edit">ACCOUNT BEWERKEN</span>
          <img v-if="edit" class="nav-icon" src="../../assets/images/signup/permission/icon_check_white.svg" alt="icn_edit" @click="switchMode">
          <img v-if="!edit" class="nav-icon" src="../../assets/images/profile/icn_edit.svg" alt="icn_edit" @click="switchMode">
        </div>

        <div v-if="!edit" class="wrapper">
          <img class="profile-img" :src="require('../../assets/images/users/' + profilePic )" />
          <p class="icon-title">
            {{firstname}} {{lastname}}
          </p>
          <p class="icon-text">
            {{nickname}}
          </p>
        </div>
        <div v-if="edit" class="wrapper">
          <div class="profile-img edit">
            <img :src="require('../../assets/images/users/' + profilePic)"/>
            <div class="profile-img-overlay"></div>
            <img class="add-picture-icn" src="../../assets/images/profile/icn_add_picture.svg" />
          </div>
        </div>
      </div>
      <div v-if="!edit" class="tabs is-fullwidth">
        <ul>
          <li :class="{'is-active': active_tab === 'profile'}">
            <a @click.prevent="active_tab = 'profile'">Profiel</a>
          </li>
          <li :class="{'is-active': active_tab === 'badges'}">
            <a @click.prevent="active_tab = 'badges'">Badges</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'profile'">
      <input-floating-label id="firstname" class="grey-bg-input" label="VOORNAAM" type="text" :disabled="!edit" :value.sync="firstname" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="lastname" class="grey-bg-input" label="ACHTERNAAM" type="text" :disabled="!edit" :value.sync="lastname" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="nickname" class="grey-bg-input" label="NICK NAME" type="text" :disabled="!edit" :value.sync="nickname" icon="icn_nickname.svg"></input-floating-label>
      <input-floating-label id="mobile" class="grey-bg-input" label="MOBIEL TELEFOONNUMMER" type="number" :disabled="!edit" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
    </div>
    <div class="wrapper" v-if="active_tab === 'badges'">

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import InputFloatingLabel from '../../components/InputFloatingLabel.vue';

@Component({
  components:{
    InputFloatingLabel
  }
})
export default class Profile extends Vue {
  edit: boolean = false;
  active_tab: string = 'profile';
  firstname: string = 'Maria';
  lastname: string = 'Schuurman';
  nickname: string = 'Mamaria';
  profilePic: string = 'maria1.jpg';
  mobile: string = '';

  //Methods
  switchMode () {
    this.edit = !this.edit
  }
}
</script>

<style lang="scss">
  #profile{
    .wrapper{
      position:relative;
      padding:0;
      p.icon-text{
        margin-bottom:10px;
      }
      .profile-img.edit{
        position: relative;
        width: 125px;
        height: 125px;
        margin: 30px auto 53px;
        border: 3px solid #915C80;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        img{
          height:100%;
        }
      }
      .profile-img-overlay{
        top:0;
        opacity:0.5;
        content:'';
        width:100%;
        height:100%;
        border-radius: 50%;
        position:absolute;
        background-color:#000;
      }
      .add-picture-icn{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 40%;
        margin: 0 auto;
      }
    }
  }
</style>