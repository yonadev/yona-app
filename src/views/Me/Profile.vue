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
          <img v-if="profilePic" class="profile-img" :src="profilePic" />
          <div v-else class="profile-img">
            <span class="text">{{account.firstname.charAt(0)}}{{account.lastname.charAt(0)}}</span>
          </div>
          <p class="icon-title">
            {{account.firstname}} {{account.lastname}}
          </p>
          <p class="icon-text">
            {{account.nickname}}
          </p>
        </div>
        <div v-if="edit" class="wrapper">
          <div class="profile-img edit">
            <img v-if="profilePic" :src="profilePic" />
            <div class="profile-img-overlay"></div>
            <label for="profile-image">
              <img class="add-picture-icn" src="../../assets/images/profile/icn_add_picture.svg" />
            </label>
            <input type="file" name="profile-image" id="profile-image" class="hidden-profile-image" @change="submitPhoto" accept="image/*">
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
      <input-floating-label id="mobile" class="grey-bg-input" label="MOBIEL TELEFOONNUMMER" type="text" :disabled="!edit" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
    </div>
    <div class="wrapper" v-if="active_tab === 'badges'">

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import InputFloatingLabel from '@/components/InputFloatingLabel.vue';
import {Action, State} from "vuex-class";
import {AccountState} from "@/store/account/types";
import {Watch} from "vue-property-decorator";
import {ApiState} from "@/store/api/types";
import axios from "@/utils/axios/axios"

@Component({
  components:{
    InputFloatingLabel
  }
})
export default class Profile extends Vue {
  @State('account') account!: AccountState;
  @State('api') api!: ApiState;
  @Action('setProperty', {namespace: 'account'}) setProperty: any;
  edit: boolean = false;
  active_tab: string = 'profile';
  firstname: string | null = '';
  lastname: string | null = '';
  mobile: string | null = '';
  nickname: string | null = '';
  profilePic: string | ArrayBuffer | null = '';

  async mounted(){
    this.firstname = this.account.firstname;
    this.lastname = this.account.lastname;
    this.mobile = this.account.phonenumber;
    this.nickname = this.account.nickname;
    this.profilePic = this.account.userphoto;
  }

  //Methods
  async switchMode () {
    if(this.edit){
      if(this.api.links && this.api.links['edit']) {
        let response: any = await axios.put(this.api.links['edit'].href, {
          "firstName": this.firstname,
          "lastName": this.lastname,
          "mobileNumber": this.mobile,
          "nickname": this.nickname
        }).catch((error) => {
          console.log(error)
        });

        console.log(response)
      }
    }

    this.edit = !this.edit
  }

  async submitPhoto () {
    let file: any = document.getElementById('profile-image');

    if(!file)
      return false;

    let formData = new FormData();
    formData.append( 'file', file.files[0] );

    if(this.api.links && this.api.links['yona:editUserPhoto']) {
      let response: any = await axios.put(this.api.links['yona:editUserPhoto'].href, formData).catch((error) => {
        console.log(error)
      });

      if (response.status == 200) {
        let photo_response: any = await axios.get(response.data._links['yona:userPhoto'].href, {
          responseType: 'blob'
        }).catch((error) => {
          console.log(error)
        });

        let self = this

        if (FileReader && photo_response.data) {
          var fr = new FileReader();
          fr.onload = await function () {
            self.setProperty({userphoto: fr.result})
            self.profilePic = fr.result
          }
          fr.readAsDataURL(photo_response.data);
        }
      }
    }
  }

  @Watch('firstname')
  firstnameChanged(val: string | null) {
    if(val)
      this.setProperty({firstname: val})
  }
  @Watch('lastname')
  lastnameChanged(val: string | null) {
    if(val)
      this.setProperty({lastname: val})
  }
  @Watch('nickname')
  nicknameChanged(val: string | null) {
    if(val)
      this.setProperty({nickname: val})
  }
  @Watch('mobile')
  mobileChanged(val: string | null) {
    if(val)
      this.setProperty({phonenumber: val})
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
      .profile-img {
        position:relative;
        .text{
          font-weight: 300;
          color: #fff;
          font-size: 2rem;
          display: inline-block;
          padding: 34px 30px;
        }
        &.edit{
          position: relative;
          width: 125px;
          height: 125px;
          margin: 30px auto 53px;
          border: 3px solid #915C80;
          border-radius: 50%;
          overflow: hidden;
          box-sizing: border-box;
          background-color: transparent;
          img {
            height: 100%;
            max-width: 100%;
          }
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
      .hidden-profile-image{
        opacity:0;
      }
    }
  }
</style>