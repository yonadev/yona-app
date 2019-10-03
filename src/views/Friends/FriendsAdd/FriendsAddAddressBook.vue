<template>
  <div id="add-friend" class="wrapper grey-bg" :loading="loading">
    <input-floating-label
      id="firstname"
      class="grey-bg-input"
      :label="$t('firstname')"
      type="text"
      :value.sync="firstname"
      icon="icn_name.svg"
    ></input-floating-label>
    <input-floating-label
      id="lastname"
      class="grey-bg-input"
      :label="$t('lastname')"
      type="text"
      :value.sync="lastname"
      icon="icn_name.svg"
    ></input-floating-label>
    <input-floating-label
      id="email"
      class="grey-bg-input"
      :label="$t('email')"
      type="email"
      :value.sync="email"
      icon="icn_mail.svg"
    ></input-floating-label>
    <input-floating-label
      id="mobile"
      class="grey-bg-input"
      :label="$t('mobilenumber')"
      type="text"
      :value.sync="mobile"
      icon="icn_mobile.svg"
    ></input-floating-label>
    <input-floating-label
      id="message"
      class="grey-bg-input"
      :label="$t('comment')"
      type="text"
      :value.sync="message"
      icon="icn_name.svg"
    ></input-floating-label>

    <a class="button is-rounded add-friend" @click="addFriend">{{
      $t("invitefriend")
    }}</a>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";
import { Watch } from "vue-property-decorator";
import { ApiState } from "@/store/api/types";
import { State } from "vuex-class";
import axios from "@/utils/axios/axios";

@Component({
  components: {
    InputFloatingLabel
  }
})
export default class FriendsAddAddressBook extends Vue {
  @State("api") api!: ApiState;
  loading: boolean = false;
  firstname: string | null = "";
  lastname: string | null = "";
  mobile: string | null = "";
  nickname: string | null = "";
  message: string | null = "";
  email: string | null = "";

  mounted() {
    this.addFromAddressBook();
  }

  @Watch("mobile")
  mobileChanged(val: string | null) {
    if (val) {
      if (val.charAt(0) == "0") {
        val = "+31" + val.substr(1);
        this.mobile = val;
      }
    }
  }

  async addFriend() {
    if (this.api.embedded && !this.loading) {
      this.loading = true;
      let response: any = await axios
        .post(this.api.embedded["yona:buddies"]._links.self.href, {
          sendingStatus: "REQUESTED",
          receivingStatus: "REQUESTED",
          message: this.message,
          _embedded: {
            "yona:user": {
              firstName: this.firstname,
              lastName: this.lastname,
              mobileNumber: this.mobile,
              emailAddress: this.email,
              nickname: this.nickname
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

      this.loading = false;

      if (response) this.$router.push({ name: "FriendsOverview" });
    }
  }

  async addFromAddressBook() {
    const self = this;
    //@ts-ignore
    navigator.contacts.pickContact(
      function(contact: any) {
        if (contact) {
          self.firstname = contact.name.givenName;
          self.lastname = contact.name.familyName;
          self.email = contact.emails[0].value;
          self.mobile = contact.phoneNumbers[0].value;
        }
      },
      function(err: any) {
        console.log("Error: " + err);
      }
    );
  }
}
</script>

<style lang="scss">
@import "../../../sass/variables";

#add-friend {
  .add-friend {
    margin: 20px 0;
    border-color: $color-blue;
    color: $color-blue;
    background-color: transparent;
    width: 85%;
    padding: 5px 0;
    font-size: 1.2rem;
  }
}
</style>
