<template>
  <div id="friends-tabs" class="header-template" :loading="loading">
    <div class="colored-background blue">
      <div class="nav-title">
        {{ $t("add_friend") }}
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
          <router-link
            tag="li"
            :to="{ name: 'FriendsAddManual' }"
            active-class="is-active"
          >
            <a>{{ $t("addfriendmanually") }}</a>
          </router-link>
          <li>
            <a @click="addFromAddressBook()">{{ $t("addfriendcontacts") }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg">
      <div id="add-friend" class="wrapper grey-bg" :loading="loading">
        <form @submit.prevent="addFriend()">
          <input-floating-label
            id="firstname"
            :validate="{ required: true }"
            class="grey-bg-input"
            :label="$t('firstname')"
            type="text"
            :value.sync="firstname"
            icon="icn_name.svg"
          ></input-floating-label>
          <input-floating-label
            id="lastname"
            :validate="{ required: true }"
            class="grey-bg-input"
            :label="$t('lastname')"
            type="text"
            :value.sync="lastname"
            icon="icn_name.svg"
          ></input-floating-label>
          <input-floating-label
            id="email"
            :validate="{ required: true }"
            class="grey-bg-input"
            :label="$t('email')"
            type="email"
            :value.sync="email"
            icon="icn_mail.svg"
          ></input-floating-label>
          <input-floating-label
            id="mobile"
            class="grey-bg-input"
            :validate="{ required: true, mobile: true }"
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
          <input
            type="submit"
            class="button is-rounded add-friend"
            :value="$t('invitefriend')"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";
import { Watch } from "vue-property-decorator";
import { ApiState } from "@/store/api/types";
import { Action, State } from "vuex-class";
import axios from "@/utils/axios/axios";

@Component({
  components: {
    InputFloatingLabel
  }
})
export default class FriendsAddManual extends Vue {
  @State("api") api!: ApiState;
  @Action("setLogOffOnPause", { namespace: "login" }) setLogOffOnPause: any;
  loading: boolean = false;
  firstname: string | null = "";
  lastname: string | null = "";
  mobile: string | null = "";
  nickname: string | null = "";
  message: string | null = "";
  email: string | null = "";

  @Watch("mobile")
  mobileChanged(val: string | null) {
    if (val) {
      if (/\s/.test(val)) {
        val = val.split(" ").join("");
      }
      if (val.charAt(0) === "0" && val.charAt(1) === "6") {
        val = "+31" + val.substr(1);
      }
      if (val.charAt(0) === "+" && val.charAt(3) === "0") {
        val = val.substr(0, 3) + val.substr(4);
      }

      this.mobile = val;
    }
  }

  async addFriend() {
    this.$validator.validate().then(async valid => {
      if (valid) {
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
            .catch();

          this.loading = false;

          if (response) this.$router.push({ name: "FriendsOverview" });
        }
      }
    });
  }

  hasReadContactsPermission(): Promise<boolean> {
    //@ts-ignore
    const Permission = window.plugins.Permission;
    const permission = "android.permission.READ_CONTACTS";

    return new Promise((resolve, reject) => {
      Permission.has(
        permission,
        function(results: any) {
          if (!results[permission]) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
        (err: string) => reject(err)
      );
    });
  }

  requestReadContactsPermission(): Promise<boolean> {
    //@ts-ignore
    const Permission = window.plugins.Permission;
    const permission = "android.permission.READ_CONTACTS";
    return new Promise((resolve, reject) => {
      Permission.request(
        permission,
        function(results: any) {
          if (results[permission]) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (err: string) => reject(err)
      );
    });
  }

  async addFromAddressBook() {
    const self = this;

    const hasPermission = await this.hasReadContactsPermission().catch();
    let requestedSucces = null;
    if (!hasPermission) {
      this.setLogOffOnPause(false);
      requestedSucces = await this.requestReadContactsPermission().catch();
    }

    this.setLogOffOnPause(false);
    //@ts-ignore
    const contact = await cordova.plugins.ContactPicker.requestContact();
    if (contact) {
      if (contact.firstName) self.firstname = contact.firstName;
      else self.firstname = "";

      if (contact.lastName) self.lastname = contact.lastName;
      else self.lastname = "";

      if (contact.email) self.email = contact.email;
      else self.email = "";

      if (contact.mobileNumbers && contact.mobileNumbers.length > 0) {
        if (contact.mobileNumbers.length == 1) {
          self.mobile = contact.mobileNumbers[0];
        } else {
          self.mobile = contact.mobileNumbers[0];
        }
      } else self.mobile = "";
    }
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
