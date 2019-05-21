<template>
  <div id="add-device" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        OPNIEUW REGISTREREN
      </div>
      <div class="header-icon">
        <img src="../../../assets/images/signup/account/icn_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <p class="disclaimer">
        Wanneer je je telefoon bent kwijtgeraakt en Yona niet op een andere apparaat hebt aangemeld, kan je hier opnieuw registreren. Let op: al je gegevens gaan verloren.
      </p>

      <input-floating-label :validate="{required: true, mobile: true}" name="Telefoonnummer" id="mobile" class="with-border-input" label="MOBIEL TELEFOONNUMMER" type="tel" :value.sync="mobile" icon="icn_mobile.svg"></input-floating-label>
    </div>
    <div class="is-centered bottom-aligned">
      <span class="button" @click="checkTelNumber">INLOGGEN</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import InputFloatingLabel from '../../../components/InputFloatingLabel.vue';
  import axios from "../../../utils/axios/axios"
  import {Watch} from "vue-property-decorator";
  import {State} from "vuex-class";
  import {AccountState} from "../../../store/account/types";

  @Component({
    components:{
      InputFloatingLabel
    }
  })
  export default class PhoneNumber extends Vue {
    @State('account') account!: AccountState;
    private mobile: string = '';

    mounted () {
      this.mobile = this.account.phonenumber
    }

    @Watch('mobile')
    mobileChanged(val: string | null) {
      if(val){
        if(val.charAt(0) == '0') {
          val = '+31' + val.substr(1)
          this.mobile = val
        }
      }
    }

    checkTelNumber () {
      let self = this
      this.$validator.validate().then(async valid => {
        if (valid) {
          let response: any = await axios.post('http://192.168.1.9:8082/admin/requestUserOverwrite/?mobileNumber="'+this.mobile+'"').catch((error) => {
            console.log(error)
          });

          if(response) {
            if (response.status === 200) {
              //Successfull
              this.$router.push({'name': 'RecoverSms'});
            } else {
              //Something went wrong
            }
          }
        }
      });
    }
  }
</script>

<style lang="scss">
  #add-device{
    .bottom-aligned{
      .button{
        width:100%;
        border:0;
      }
    }
  }
</style>