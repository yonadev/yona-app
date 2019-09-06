<template>
  <div id="intro" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      {{ $t("connect") }}
    </div>
    <div class="wrapper">
      <p class="icon-title">{{ $t("step") }} {{ parseInt(index) + 1 }}</p>
      <div class="progress-bar">
        <div class="progress" :style="'width:' + 25 * index + '%'"></div>
      </div>
      <p class="icon-text">
        {{ account.permissions[permission] ? $t(permission) : "" }}
      </p>
      <img
        class="step-icon"
        :src="
          account.permissions[permission] &&
          account.permissions[permission].icon
            ? require('@/assets/images/signup/permission/' +
                account.permissions[permission].icon)
            : ''
        "
      />
      <p class="step-text">
        {{ account.permissions[permission] ? $t("info" + permission) : "" }}
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <a class="button" @click="goNext">{{ $t("next") }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "@/utils/axios/axios";
import { Component } from "vue-property-decorator";
import { AccountState } from "@/store/account/types";
import { Action, State } from "vuex-class";

@Component({})
export default class GivePermission extends Vue {
  @State("account") account!: AccountState;
  @Action("setPermission", { namespace: "account" }) setPermission: any;
  @Action("setLogOffOnPause", { namespace: "login" }) setLogOffOnPause: any;
  permission: string = "";
  index: number = 0;

  async mounted() {
    let i = 0;
    for (let permission in this.account.permissions) {
      if (
        !(this.account.permissions as any)[permission].is_allowed &&
        !(this.account.permissions as any)[permission].disabled
      ) {
        this.index = i;
        this.permission = permission;
        break;
      } else if ((this.account.permissions as any)[permission].disabled) {
        i--;
      }
      i++;
    }
  }

  async goNext() {
    let self = this;
    if (
      //@ts-ignore
      typeof cordova !== "undefined" &&
      //@ts-ignore
      typeof cordova.plugins.YonaServices !== "undefined"
    ) {
      if (this.permission === "tracking") {
        //@ts-ignore
        const hasUsageAccess = await cordova.plugins.YonaServices.checkUsageAccess();

        if (hasUsageAccess === "true") {
          //@ts-ignore
          cordova.plugins.YonaServices.enable();

          self.setPermission({
            key: self.permission,
            value: hasUsageAccess === "true"
          });
        } else {
          this.setLogOffOnPause(false);
          //@ts-ignore
          cordova.plugins.YonaServices.getUsageAccess();
        }
      } else if (this.permission === "autostart") {
        this.setLogOffOnPause(false);
        //@ts-ignore
        cordova.plugins.YonaServices.openAppStartSettings(false);
        this.setPermission({
          key: this.permission,
          value: true
        });
        this.setLogOffOnPause(true);
      } else if (this.permission === "store_files") {
        this.setLogOffOnPause(false);
        const hasPermission = await this.hasFileWritePermission().catch(err =>
          console.log(err)
        );
        let requestedSucces = null;
        if (!hasPermission) {
          requestedSucces = await this.requestFileWritePermission().catch(err =>
            console.log(err)
          );
        }

        this.setPermission({
          key: this.permission,
          value: hasPermission === true || requestedSucces === true
        });
        this.setLogOffOnPause(true);
      } else if (this.permission === "vpn") {
        if (this.account.currentDevice) {
          this.setLogOffOnPause(false);
          const vpnProfile = await axios.get(
            this.account.currentDevice.vpnProfile._links["yona:ovpnProfile"]
              .href
          );

          let fileName = vpnProfile.config.url;
          if (fileName) {
            fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
            const vpnProfilePath = await this.writeToFile(
              fileName,
              vpnProfile.data
            ).catch(err => console.log(err));

            //@ts-ignore
            const vpnConfigured = await cordova.plugins.YonaServices.configureVPN(
              {
                ...this.account.currentDevice.vpnProfile,
                vpnProfilePath: vpnProfilePath
              }
            );

            this.setPermission({
              key: this.permission,
              value: vpnConfigured === true
            });

            this.setLogOffOnPause(true);
          }
        }
      } else {
        this.setPermission({
          key: this.permission,
          value: true
        });
      }
    } else {
      //In browser
      this.setPermission({
        key: this.permission,
        value: true
      });
    }

    this.$router.push({ name: "Intro" });
  }

  writeToFile(fileName: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      window.resolveLocalFileSystemURL(
        //@ts-ignore
        cordova.file.dataDirectory,
        function(directoryEntry: any) {
          directoryEntry.getFile(
            fileName,
            { create: true },
            function(fileEntry: any) {
              fileEntry.createWriter(
                function(fileWriter: any) {
                  fileWriter.onwriteend = function() {
                    resolve(fileEntry.nativeURL);
                  };

                  fileWriter.onerror = function(e: Error) {
                    reject(e.toString());
                  };

                  const blob = new Blob([data], { type: "text/plain" });
                  fileWriter.write(blob);
                },
                (e: Error) => reject(e.toString())
              );
            },
            (e: Error) => reject(e.toString())
          );
        },
        (e: Error) => reject(e.toString())
      );
    });
  }

  hasFileWritePermission(): Promise<boolean> {
    //@ts-ignore
    const Permission = window.plugins.Permission;
    const permission = "android.permission.WRITE_EXTERNAL_STORAGE";

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

  requestFileWritePermission(): Promise<boolean> {
    //@ts-ignore
    const Permission = window.plugins.Permission;
    const permission = "android.permission.WRITE_EXTERNAL_STORAGE";
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
}
</script>

<style lang="scss">
#intro {
  img.step-icon {
    margin-top: 40px;
    width: 100px;
  }
  .step-text {
    font-weight: 300;
    font-size: 1.2rem;
    margin-top: 30px;
    padding: 0 40px;
    color: #fff;
  }
  .bottom-aligned {
    .button {
      width: 100%;
      border: 0;
    }
  }
}
</style>
