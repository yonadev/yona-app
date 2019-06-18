<template>
  <div id="friend-request" class="profile-template">
    <div class="colored-background blue">
      <div class="heading" v-if="notification">
        <div class="nav-title"></div>
        <div class="wrapper">
          <img v-if="avatar" class="profile-img" :src="avatar" />
          <div v-else class="profile-img"></div>
          <p class="icon-title">
            {{notification._embedded['yona:user'].firstName}} {{notification._embedded['yona:user'].lastName}}
          </p>
          <p class="icon-text">
            {{notification.nickname}}
          </p>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="grey-bg-div">
        <p class="has-text-left">
          <strong>Vriendschapverzoek</strong><br/><br/>
          <span class="light-text" v-if="notification.message">
            {{notification.message}} <br/><br/>
          </span>
          <span class="light-text">Let op: dit verzoek kan door iemand anders zijn verstuurd. Controleer het telefoonnummer:</span><br/>
          <span class="light-text">{{notification._embedded['yona:user'].mobileNumber}}</span>
        </p>

        <a class="button reject is-rounded is-6" @click="reject()">AFWIJZEN</a>
        <a class="button accept is-rounded is-6" @click="accept()">ACCEPTEREN</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {LinksState} from "../../store/links/types";
import axios from "../../utils/axios/axios"
import {Prop} from "vue-property-decorator";

@Component({})
export default class Notifications extends Vue {
  @State('links') links!: LinksState;
  @Prop() notification!: string;
  avatar: string | null = '';

  async mounted () {
    console.log(this.notification)
    if(this.notification) {
      let photo_response: any = await axios.get(this.notification._links['yona:userPhoto'].href, {
        responseType: 'blob'
      }).catch((error) => {
        console.log(error)
      });

      this.avatar = await URL.createObjectURL(photo_response.data)
    }
  }

  async accept(){
    let response: any = await axios.post(this.notification._links['yona:accept'].href, {}).catch((error) => {
      console.log(error)
    });

    console.log(response)
  }
  reject(){

  }
}
</script>

<style lang="scss">
  #friend-request{
    .wrapper{
      padding:0;
      .profile-img{
        width:75px;
        height:75px;
        min-height:75px;
        border: 2px solid rgba(255, 255, 255, 0.4);
        background-color: rgba(255, 255, 255, 0.4);
      }
      .icon-text{
        margin-bottom:55px;
      }
      .grey-bg-div{
        background-image: linear-gradient(#f7f7f7, #fcfcfc);
        padding:15px 25px 15px 25px;
        .light-text{
          opacity:0.6
        }
        .button{
          margin-top:10px;
          border:none;
          color:#fff;
          width:38%;
          padding: 6px 13px;
          &.accept{
            background-color:#95c11f;
          }
          &.reject{
            background-color:#e8308a;
            margin-right:10px;
          }
        }
      }
    }
  }
</style>