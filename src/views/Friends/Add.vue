<template>
  <div id="add-friend" class="header-template">
    <div class="colored-background blue">
      <div class="nav-title">
        VRIEND TOEVOEGEN
      </div>
      <div class="tabs is-fullwidth">
        <ul>
          <li :class="{'is-active': active_tab === 'manual'}">
            <a @click.prevent="active_tab = 'manual'">Handmatig</a>
          </li>
          <li :class="{'is-active': active_tab === 'addressbook'}">
            <a @click.prevent="active_tab = 'addressbook'">Uit adresboek</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'manual'">
      <input-floating-label id="firstname" class="grey-bg-input" label="VOORNAAM" type="text" :value.sync="firstname" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="lastname" class="grey-bg-input" label="ACHTERNAAM" type="text" :value.sync="lastname" icon="icn_name.svg"></input-floating-label>
      <input-floating-label id="email" class="grey-bg-input" label="EMAIL" type="email" :value.sync="email" icon="icn_mail.svg"></input-floating-label>
      <input-floating-label id="mobile" class="grey-bg-input" label="MOBIEL TELEFOONNUMMER" type="text" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
      <input-floating-label id="message" class="grey-bg-input" label="BERICHT" type="text" :value.sync="message" icon="icn_name.svg"></input-floating-label>

      <a class="button is-rounded add-friend" @click="addFriend">VRIEND UITNODIGEN</a>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'addressbook'">
      Uit adresboek
    </div>
  </div>
</template>


<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import InputFloatingLabel from '../../components/InputFloatingLabel.vue';
  import {Watch} from 'vue-property-decorator'
  import {ApiState} from "@/store/api/types";
  import {State} from "vuex-class";
  import axios from "@/utils/axios/axios"

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class Add extends Vue {
    @State('api') api!: ApiState;
    active_tab: string = 'manual';
    firstname: string | null = '';
    lastname: string | null = '';
    mobile: string | null = '';
    nickname: string | null = '';
    message: string | null = '';
    email: string | null = '';

    @Watch('mobile')
    mobileChanged(val: string | null) {
      if(val){
        if(val.charAt(0) == '0') {
          val = '+31' + val.substr(1)
          this.mobile = val
        }
      }
    }

    async addFriend(){
      if(this.api.embedded) {
        let response: any = await axios.post(this.api.embedded['yona:buddies']._links.self.href, {
          "sendingStatus": "REQUESTED",
          "receivingStatus": "REQUESTED",
          "message": this.message,
          "_embedded": {
            "yona:user": {
              "firstName": this.firstname,
              "lastName": this.lastname,
              "mobileNumber": this.mobile,
              "emailAddress": this.email,
              "nickname": this.nickname
            }
          }
        }).catch((error) => {
          console.log(error)
        });

        if (response)
          this.$router.push({'name': 'TimeLine'});
      }
    }
  }
</script>

<style lang="scss">
  @import "../../sass/variables";

  #add-friend{
    .small-profile-img{
      vertical-align: middle;
      top: -2px;
      width:30px;
      height:30px;
      border-radius: 50%;
      position:relative;
      background-color:#000;
      margin-right: 20px;
    }
    .nav-title{
      padding:30px 15px 10px 15px;
    }
    .wrapper{
      padding:0;
      &.grey-bg{
        background-color:#f3f3f3;
      }
    }
    .add-friend{
      margin:20px 0;
      border-color: $color-blue;
      color:$color-blue;
      background-color:transparent;
      padding:5px 40px;
      font-size:14px;
    }
  }
</style>