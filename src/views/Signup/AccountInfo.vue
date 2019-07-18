<template>
  <div id="account-info" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{$t('join')}}
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <input-floating-label :validate="{required: true, mobile: true}" id="mobile" class="with-border-input" :label="$t('mobilenumber')" type="tel" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
      <input-floating-label :validate="{required: true}" id="nickname" class="with-border-input" :label="$t('nickname')" type="text" :value.sync="nickname" icon="icn_nickname.svg"></input-floating-label>

      <p class="disclaimer">
        {{$t('usersignupmessage')}}
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Names'}">{{$t('previous')}}</router-link>
      <span class="button" @click="checkTelNumber">{{$t('next')}}</span>
    </div>

    <!-- ToDo: Make it a cordova modal -->
    <div class="is-centered" v-if="choose">
      <router-link class="button" :to="{name: 'AddDevice'}">{{$t('adddevice')}}</router-link>
      <router-link class="button" :to="{name: 'PhoneNumber'}">{{$t('registeragain')}}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Watch, Component } from 'vue-property-decorator'
  import InputFloatingLabel from '@/components/InputFloatingLabel.vue';
  import {Action, State} from "vuex-class";
  import {AccountState} from "@/store/account/types";
  import axios from "@/utils/axios/axios"
  import {ApiState} from "@/store/api/types";

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class AccountInfo extends Vue {
    @State('account') account!: AccountState;
    @State('api') api!: ApiState;
    @Action('setProperty', {namespace: 'account'}) setProperty: any;
    mobile: string | null = '';
    nickname: string | null = '';
    choose: boolean = false;

    mounted(){
      this.mobile = this.account.phonenumber
      this.nickname = this.account.nickname;
    }

    checkTelNumber () {
      let self = this
      this.$validator.validate().then(async valid => {
        if (valid) {
          let response: any = await axios.post(this.api.host + '/users/', {
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
        if(val.charAt(0) === '0' && val.charAt(1) === '6') {
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