<template>
  <div id="names" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        DOE MEE
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg"/>
      </div>
    </div>
    <div class="wrapper">
      <input-floating-label :validate="{required: true}" name="Voornaam" id="firstname" :disabled="false" class="with-border-input" label="VOORNAAM" :value.sync="firstname" type="text" icon="icn_name.svg"></input-floating-label>
      <input-floating-label :validate="{required: true}" name="Achternaam" id="lastname" class="with-border-input" label="ACHTERNAAM" :value.sync="lastname" type="text" icon="icn_name.svg"></input-floating-label>

      <p class="disclaimer">
        Yona respecteert en beschermt je privacy. Alle gevoelige informatie is beveiligd met encryptie.
      </p>
    </div>

    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Choose'}">VORIGE</router-link>
      <div @click="validateFields()" class="button">VOLGENDE</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InputFloatingLabel from '../../components/InputFloatingLabel.vue';
import {Action, State} from "vuex-class";
import {AccountState} from "../../store/account/types";
import {Watch, Component, Provide} from 'vue-property-decorator'

@Component({
  components:{
    InputFloatingLabel
  }
})
export default class Names extends Vue {
  @State('account') account!: AccountState;
  @Action('setProperty', {namespace: 'account'}) setProperty: any;
  firstname: string | null = '';
  lastname: string | null = '';

  mounted(){
    this.firstname = this.account.firstname;
    this.lastname = this.account.lastname;
  }

  validateFields(){
    this.$validator.validate().then(valid => {
      if (valid) {
        this.$router.push({'name': 'AccountInfo'});
      }
    });
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
}
</script>

<style lang="scss"></style>