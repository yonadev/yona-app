<template>
  <div id="friends-profile" class="profile-template">
    <div class="colored-background blue">
      <div class="heading">
        <div class="nav-title"></div>

        <div class="wrapper">
          <img v-if="friendPic" class="profile-img" :src="friendPic" />
          <div v-else class="profile-img"></div>
          <p class="icon-title">
            {{firstName}} {{lastName}}
          </p>
          <p class="icon-text">
            {{nickName}}
          </p>
        </div>
      </div>
      <div class="tabs is-fullwidth">
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
      <input-floating-label id="firstname" class="grey-bg-input" label="VOORNAAM" type="text" :disabled="true" :value="firstName" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="lastname" class="grey-bg-input" label="ACHTERNAAM" type="text" :disabled="true" :value="lastName" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="nickname" class="grey-bg-input" label="NICK NAME" type="text" :disabled="true" :value="nickName" icon="icn_nickname.svg"></input-floating-label>
      <input-floating-label id="mobile" class="grey-bg-input" label="MOBIEL TELEFOONNUMMER" type="text" :disabled="true" :value="mobileNumber" icon="icn_mobile.svg"></input-floating-label>

      <a class="button is-rounded remove-friend" @click="removeFriend">VRIEND VERWIJDEREN</a>
    </div>
    <div class="wrapper" v-if="active_tab === 'badges'">

    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import InputFloatingLabel from '../../../components/InputFloatingLabel.vue';
import Component from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import axios from "../../../utils/axios/axios"

@Component({
  components:{
    InputFloatingLabel
  }
})
export default class FriendsProfile extends Vue {
  @Prop() link!: string;
  active_tab: string | null = 'profile';
  friendPic: string | null = '';
  firstName: string | null = '';
  lastName: string | null = '';
  nickName: string | null = '';
  mobileNumber: string | null = '';

  async mounted () {
    let buddy = await axios.get(this.link).catch((error) => {
      console.log(error)
    });

    if(buddy.status == 200){
      this.firstName = buddy.data._embedded['yona:user'].firstName
      this.lastName = buddy.data._embedded['yona:user'].lastName
      this.mobileNumber = buddy.data._embedded['yona:user'].mobileNumber
      this.nickName = buddy.data._embedded['yona:user'].nickname

      let photo_response: any = await axios.get(buddy.data._embedded['yona:user']._links['yona:userPhoto'].href, {
        responseType: 'blob'
      }).catch((error) => {
        console.log(error)
      });

      this.friendPic = await URL.createObjectURL(photo_response.data)
    }
  }

  async removeFriend(){
    let buddy = await axios.delete(this.link).catch((error) => {
      console.log(error)
    });

    if(buddy.response == 200){
      this.$router.push({'name': 'TimeLine'});
    }
  }
}
</script>

<style lang="scss">
  @import "../../../sass/variables";

  #friends-profile{
    .profile-img{
      width:75px;
      height:75px;
      min-height:75px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      background-color: rgba(255, 255, 255, 0.4);
    }
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
      }
      p.icon-text{
        margin-bottom:10px;
      }
      .remove-friend{
        margin:20px 0;
        border-color: $color-blue;
        color:$color-blue;
        background-color:transparent;
        width: 85%;
        padding:5px 0;
        font-size:14px;
      }
      .control{
        .input-floating-label.is-focused label{
          color:rgba(0, 0, 0, 0.4)!important;
        }
      }
    }
  }
</style>