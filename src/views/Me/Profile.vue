<template>
  <div id="profile" class="profile-template">
    <div class="colored-background purple-dark">
      <div class="heading">
        <div class="nav-title" v-if="active_tab === 'badges'"></div>
        <div class="nav-title" v-if="active_tab === 'profile'">
          <span v-if="edit">{{ $t("edit_profile") }}</span>
          <img
            v-if="edit"
            class="nav-icon"
            src="../../assets/images/signup/permission/icon_check_white.svg"
            alt="icn_edit"
            @click="switchMode"
          />
          <img
            v-if="!edit"
            class="nav-icon"
            src="../../assets/images/profile/icn_edit.svg"
            alt="icn_edit"
            @click="switchMode"
          />
        </div>
        <div v-if="!edit" class="wrapper">
          <profile-pic class="profile-img" src="user_image"></profile-pic>
          <p class="icon-title">
            {{ account.firstname }} {{ account.lastname }}
          </p>
          <p class="icon-text">
            {{ account.nickname }}
          </p>
        </div>
        <div v-if="edit" class="wrapper">
          <div class="profile-img edit" @click="captureProfilePicture">
            <profile-pic src="user_image"></profile-pic>
            <div class="profile-img-overlay"></div>
            <img
              class="add-picture-icn"
              src="../../assets/images/profile/icn_add_picture.svg"
            />
          </div>
        </div>
      </div>
      <div v-if="!edit" class="tabs is-fullwidth">
        <ul>
          <li :class="{ 'is-active': active_tab === 'profile' }">
            <a @click.prevent="active_tab = 'profile'">{{ $t("profile") }}</a>
          </li>
          <li :class="{ 'is-active': active_tab === 'badges' }">
            <a @click.prevent="active_tab = 'badges'">{{ $t("badges") }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'profile'">
      <input-floating-label
        id="firstname"
        :validate="{ required: true }"
        class="grey-bg-input"
        :label="$t('firstname')"
        type="text"
        :disabled="!edit"
        :value.sync="firstname"
        icon="icn_name.svg"
      ></input-floating-label>
      <input-floating-label
        id="lastname"
        :validate="{ required: true }"
        class="grey-bg-input"
        :label="$t('lastname')"
        type="text"
        :disabled="!edit"
        :value.sync="lastname"
        icon="icn_name.svg"
      ></input-floating-label>
      <input-floating-label
        id="nickname"
        :validate="{ required: true }"
        class="grey-bg-input"
        :label="$t('nickname')"
        type="text"
        :disabled="!edit"
        :value.sync="nickname"
        icon="icn_nickname.svg"
      ></input-floating-label>
      <input-floating-label
        id="mobile"
        :validate="{ required: true, mobile: true }"
        class="grey-bg-input"
        :label="$t('mobilenumber')"
        type="text"
        :disabled="!edit"
        :value.sync="mobile"
        icon="icn_mobile.svg"
      ></input-floating-label>
    </div>
    <div class="wrapper" v-if="active_tab === 'badges'"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";
import { Action, State } from "vuex-class";
import { AccountState } from "@/store/account/types";
import { Watch } from "vue-property-decorator";
import { ApiState } from "@/store/api/types";
import axios from "@/utils/axios/axios";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";

@Component({
  components: {
    ProfilePic,
    InputFloatingLabel
  }
})
export default class Profile extends Vue {
  @State("account") account!: AccountState;
  @State("api") api!: ApiState;
  @Action("setProperty", { namespace: "account" }) setProperty: any;
  edit: boolean = false;
  active_tab: string = "profile";
  firstname: string | null = "";
  lastname: string | null = "";
  mobile: string | null = "";
  nickname: string | null = "";
  imageUri: string | null = null;

  async mounted() {
    this.firstname = this.account.firstname;
    this.lastname = this.account.lastname;
    this.mobile = this.account.phonenumber;
    this.nickname = this.account.nickname;
  }

  //Methods
  async switchMode() {
    let valid = await this.$validator.validateAll();

    if (valid) {
      if (this.edit) {
        if (this.api.links && this.api.links["edit"]) {
          let response: any = await axios
            .put(this.api.links["edit"].href, {
              firstName: this.firstname,
              lastName: this.lastname,
              mobileNumber: this.mobile,
              nickname: this.nickname
            })
            .catch(error => {
              console.log(error);
            });
        }
      }

      this.edit = !this.edit;
    }
  }

  captureProfilePicture() {
    const self = this;
    //@ts-ignore
    if (plugins != undefined && plugins.crop) {
      //@ts-ignore
      plugins.crop(
        function success(data: string) {
          self.submitPhoto(data);
        },
        function fail() {},
        { quality: 100 }
      );
    }
  }

  async submitPhoto(base64String: string) {
    const self = this;
    let formData = new FormData();
    formData.append("file", this.getBlob(base64String, "image/jpeg"));

    if (this.api.links && this.api.links["yona:editUserPhoto"]) {
      let response: any = await axios
        .put(this.api.links["yona:editUserPhoto"].href, formData)
        .catch(error => {
          console.log(error);
        });

      if (response.status == 200) {
        let photo_response: any = await axios
          .get(response.data._links["yona:userPhoto"].href, {
            responseType: "arraybuffer"
          })
          .catch(error => {
            console.log(error);
          });

        if (photo_response) {
          //@ts-ignore
          const userPhoto = new Buffer.from(
            photo_response.data,
            "binary"
          ).toString("base64");
          window.localStorage.setItem(
            "user_image",
            JSON.stringify({
              type: "me",
              src: "data:image/png;base64," + userPhoto
            })
          );
          self.edit = false;
        }
      }
    }
  }

  private getBlob(
    b64Data: string,
    contentType: string,
    sliceSize: number = 512
  ) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  @Watch("firstname")
  firstnameChanged(val: string | null) {
    if (val) this.setProperty({ firstname: val });
  }
  @Watch("lastname")
  lastnameChanged(val: string | null) {
    if (val) this.setProperty({ lastname: val });
  }
  @Watch("nickname")
  nicknameChanged(val: string | null) {
    if (val) this.setProperty({ nickname: val });
  }
  @Watch("mobile")
  mobileChanged(val: string | null) {
    if (val) {
      if (val.charAt(0) === "0" && val.charAt(1) === "6") {
        val = "+31" + val.substr(1);
        this.mobile = val;
      }

      this.setProperty({ phonenumber: val });
    }
  }
}
</script>

<style lang="scss">
#profile {
  .wrapper {
    position: relative;
    padding: 0;
    p.icon-text {
      margin-bottom: 10px;
    }
    .profile-img {
      img {
        position: relative;
        border-radius: 50%;
      }

      svg{
        height:100%;
      }

      &.edit {
        position: relative;
        width: 125px;
        height: 125px;
        margin: 30px auto 53px;
        border: 3px solid #915c80;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        background-color: transparent;
         > div {
           display: block;
         }
        img {
          border-radius: 50%;
          height: 100%;
          max-width: 100%;

          &.add-picture-icn {
            position: absolute;
            border-radius: 0;
            top: 0;
            left: 0;
            right: 0;
            width: 40%;
            margin: 0 auto;
          }
        }
      }
    }
    .profile-img-overlay {
      top: 0;
      opacity: 0.5;
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: absolute;
      background-color: #000;
    }

    .hidden-profile-image {
      opacity: 0;
    }
  }
}
</style>
