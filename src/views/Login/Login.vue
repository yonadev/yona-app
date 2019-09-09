<template>
  <div id="login" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("login") }}
    </div>
    <div class="wrapper">
      <img class="icon-img" src="../../assets/images/login/icn_y.png" />
      <p class="icon-title">
        {{ $t("passcodetitle") }}
      </p>
      <p v-if="error" class="has-text-white-ter">
        {{ $t("passcodeincorrect", { tries: 5 - login.loginAttempts }) }}
      </p>
      <pin-code
        :pincode.sync="password"
        :length="length"
        ref="pincode"
      ></pin-code>
      <p class="reset" @click="confirmPinReset">
        {{ $t("passcodereset") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import PinCode from "../../components/PinCode.vue";
import axios from "@/utils/axios/axios";
import { Action, State } from "vuex-class";
import { LoginState } from "@/store/login/types";
import { ApiState } from "@/store/api/types";

@Component({
  components: {
    PinCode
  }
})
export default class Login extends Vue {
  @State("login") login!: LoginState;
  @Action("setLoggedIn", { namespace: "login" }) setLoggedIn: any;
  @Action("setOffline", { namespace: "api" }) setOffline: any;
  @Action("increaseLoginAttempts", { namespace: "login" })
  increaseLoginAttempts: any;
  @State("api") api!: ApiState;
  @Action("setProperty", { namespace: "login" }) setProperty: any;
  @Action("setUserData", { namespace: "account" }) setUserData: any;
  @Action("pinReset", { namespace: "login" }) pinReset: any;
  password: number | null = null;
  length: number = 4;
  error: boolean = false;

  confirmPinReset() {
    const self = this;

    //@ts-ignore
    if (navigator && navigator.notification) {
      //@ts-ignore
      navigator.notification.confirm(
        self.$t("resetpinalert"),
        (result: number) => {
          if (result === 2) {
            self.pinReset();
          }
        },
        "",
        [self.$t("cancel"), self.$t("yes")]
      );
    } else {
      //@ts-ignore
      if (confirm(self.$t("resetpinalert"))) {
        self.pinReset();
      }
    }
  }

  @Watch("password")
  async onChildChanged(val: number) {
    if (val && val.toString().length === this.length) {
      if (!this.api.online) {
        this.setOffline();
        return;
      }
      if (val === this.login.pinCode) {
        if (this.api.links) {
          let user_response: any = await axios.get(this.api.links["self"].href);

          if (user_response) {
            const success = await this.setUserData(user_response.data);

            if (!success) {
              return;
            }
          } else {
            return;
          }

          if (this.api.links["yona:userPhoto"]) {
            let photo_response: any = await axios.get(
              this.api.links["yona:userPhoto"].href,
              {
                responseType: "arraybuffer"
              }
            );

            if (photo_response) {
              //@ts-ignore
              const userPhoto = new Buffer.from(
                photo_response.data,
                "binary"
              ).toString("base64");
              //@ts-ignore
              NativeStorage.setItem(
                "user_image",
                JSON.stringify({
                  type: "me",
                  src: "data:image/png;base64," + userPhoto
                }),
                function(success: any) {
                  console.log(success);
                },
                function(error: any) {
                  console.log(error);
                }
              );
            }
          } else {
            //@ts-ignore
            NativeStorage.getItem(
              "user_image",
              function(success: any) {
                console.log(success);
              },
              function(error: any) {
                //@ts-ignore
                NativeStorage.setItem(
                  "user_image",
                  JSON.stringify({
                    type: "me",
                    text:
                      user_response.data.firstName.charAt(0) +
                      user_response.data.lastName.charAt(0)
                  }),
                  function(success: any) {
                    console.log(success);
                  },
                  function(error: any) {
                    console.log(error);
                  }
                );
              }
            );
          }

          this.setLoggedIn(true);
        }
      } else {
        this.error = true;
        this.increaseLoginAttempts();
      }
      this.password = null;
    }
  }
}
</script>

<style lang="scss"></style>
