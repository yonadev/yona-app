<template>
  <div id="names" class="header-template">
    <div class="colored-background purple-dark">
      <div class="nav-title">
        {{ $t("join") }}
      </div>
      <div class="header-icon">
        <img src="../../assets/images/signup/account/add_avatar.svg" />
      </div>
    </div>
    <form @submit.prevent="validateFields()">
      <div class="wrapper">
        <input-floating-label
          :validate="{ required: true }"
          id="firstname"
          :disabled="false"
          class="with-border-input"
          :label="$t('firstname')"
          :value.sync="firstname"
          type="text"
          icon="icn_name.svg"
        ></input-floating-label>
        <input-floating-label
          :validate="{ required: true }"
          id="lastname"
          class="with-border-input"
          :label="$t('lastname')"
          :value.sync="lastname"
          type="text"
          icon="icn_name.svg"
        ></input-floating-label>

        <p class="disclaimer">
          {{ $t("privacypolicy") }}
        </p>
      </div>

      <div class="is-centered bottom-aligned">
        <router-link class="button" :to="{ name: 'Choose' }">{{
          $t("previous")
        }}</router-link>
        <input type="submit" class="button" :value="$t('next')" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";
import { Action, State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import { Watch, Component } from "vue-property-decorator";

@Component({
  components: {
    InputFloatingLabel
  }
})
export default class Names extends Vue {
  @State("account") account!: AccountState;
  @Action("setProperty", { namespace: "account" }) setProperty: any;
  firstname: string | null = "";
  lastname: string | null = "";

  mounted() {
    this.firstname = this.account.firstname;
    this.lastname = this.account.lastname;
  }

  validateFields() {
    this.$validator.validate().then(valid => {
      if (valid) {
        this.$router.push({ name: "AccountInfo" });
      }
    });
  }

  @Watch("firstname")
  firstnameChanged(val: string | null) {
    if (val) this.setProperty({ firstname: val });
  }
  @Watch("lastname")
  lastnameChanged(val: string | null) {
    if (val) this.setProperty({ lastname: val });
  }
}
</script>

<style lang="scss"></style>
