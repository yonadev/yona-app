<template>
  <div id="account-info" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        DOE MEE
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <input-floating-label :validate="{required: true, mobile: true}" name="Telefoonnummer" id="mobile" class="with-border-input" label="MOBIEL TELEFOONNUMMER" type="tel" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
      <input-floating-label :validate="{required: true}" name="Nickname" id="nickname" class="with-border-input" label="NICK NAME" type="text" :value.sync="nickname" icon="icn_nickname.svg"></input-floating-label>

      <p class="disclaimer">
        We gebruiken je mobile nummer voor een veilige registratie. Je nickname is verplicht en zorgt voor een nog betere privacy.
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Names'}">VORIGE</router-link>
      <span class="button" @click="checkTelNumber">VOLGENDE</span>
    </div>

    <!-- ToDo: Make it a cordova modal -->
    <div class="is-centered" v-if="choose">
      <router-link class="button" :to="{name: 'AddDevice'}">Apparaat toevoegen</router-link>
      <router-link class="button" :to="{name: 'PhoneNumber'}">Opnieuw registreren</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Watch, Component } from 'vue-property-decorator'
  import InputFloatingLabel from '../../components/InputFloatingLabel.vue';
  import {Action, State} from "vuex-class";
  import {AccountState} from "../../store/account/types";
  import axios from "../../utils/axios/axios"
  import {HeaderState} from "../../store/header/types";

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class AccountInfo extends Vue {
    @State('account') account!: AccountState;
    @State('header') header!: HeaderState;
    @Action('setProperty', {namespace: 'account'}) setProperty: any;
    mobile: string | null = '';
    nickname: string | null = '';
    choose: boolean = false;

    mounted(){
      this.mobile = this.account.phonenumber
      this.nickname = this.account.nickname;
    }
//https://app.load.yona.nu
    checkTelNumber () {
      let self = this
      this.$validator.validate().then(async valid => {
        if (valid) {
          let response: any = await axios.post('http://192.168.1.9:8082/users/', {
            firstName: this.account.firstname,
            lastName: this.account.lastname,
            mobileNumber: this.account.phonenumber,
            nickname: this.account.nickname
          }).catch((error) => {
            if(error.response.data.code === 'error.user.exists'){
              self.choose = true
            }
          });

          if(response) {
            if (response.status === 201) {
              //Successfull
              this.$router.push({'name': 'SmsValidation'});
            } else if (response.status !== 201) {
              //Probably a field missing
              this.choose = true;
            }
          }
        }
      });
    }

    @Watch('mobile')
    mobileChanged(val: string | null) {
      if(val){
        if(val.charAt(0) == '0') {
          val = '+31' + val.substr(1)
          this.mobile = val
        }

        this.setProperty({phonenumber: val})
      }
    }
    @Watch('nickname')
    nicknameChanged(val: string | null) {
      if(val)
        this.setProperty({nickname: val})
    }
  }
</script>

<style lang="scss"></style>