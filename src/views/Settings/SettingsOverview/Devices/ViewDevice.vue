<template>
  <div id="settings" class="header-template">
    <div class="colored-background yellow">
      <div class="nav-title">
        {{ $t("devices") }}
        <a @click="deleteDevice" v-if="!device.requestingDevice">
          <img
            alt="delete_device"
            class="small-top-icon is-pulled-right"
            :src="require('@/assets/images/icons/icn_trash.svg')"
          />
        </a>
      </div>
    </div>
    <div class="wrapper">
      <form @submit.prevent="updateDevice()">
        <input-floating-label
          id="device_name"
          class="grey-bg-input"
          :label="$t('device_name')"
          type="text"
          :value.sync="device_name"
          :validate="{ required: true }"
          icon="icn_mobile.svg"
        ></input-floating-label>
        <div class="grey-bg-button">
          <strong>{{ $t("operating_system") }}:</strong>
          {{ device.operatingSystem }}
        </div>
        <div class="grey-bg-button">
          <strong>{{ $t("last_seen") }}:</strong>
          {{ device.appLastOpenedDate }}
        </div>
        <div class="grey-bg-button">
          <strong>{{ $t("registered_at") }}:</strong>
          {{ formatDate(device.registrationTime) }}
        </div>
        <input
          type="submit"
          class="button is-rounded save-device"
          :value="$t('save')"
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import axios from "@/utils/axios/axios";

//@ts-ignore
import moment from "moment";
import { State } from "vuex-class";
import { ApiState } from "@/store/api/types";
import InputFloatingLabel from "@/components/InputFloatingLabel.vue";

@Component({
  components: { InputFloatingLabel },
})
export default class Devices extends Vue {
  @State("api") api!: ApiState;
  @Prop() device!: any;
  device_name: string | null = "";

  async mounted() {
    this.device_name = this.device.name;
  }

  formatDate(time: string) {
    return moment(time).format("YYYY-MM-DD HH:mm");
  }

  async updateDevice() {
    let self = this;
    this.$validator.validate().then(async (valid) => {
      if (valid) {
        let response: any = await axios
          .put(self.device._links.edit.href, {
            name: self.device_name,
          })
          .catch();

        if (response && self.api.links) {
          await self.getDevices();
        }

        this.$router.push({ path: "Devices" });
      }
    });
  }

  async deleteDevice() {
    let self = this;
    //@ts-ignore
    if (navigator && navigator.notification) {
      //@ts-ignore
      navigator.notification.confirm(
        self.$t("devicedeletemsg"),
        async (result: number) => {
          if (result === 1) {
            //Cancel
          } else if (result === 2) {
            let response: any = await axios
              .delete(this.device._links.edit.href)
              .catch();

            if (response && this.api.links) {
              await this.getDevices();
              this.$router.push({ name: "Devices" });
            }
          }
        },
        "",
        [self.$t("no"), self.$t("yes")]
      );
    } else {
      let response: any = await axios
        .delete(this.device._links.edit.href)
        .catch();

      if (response && this.api.links) {
        await this.getDevices();
        this.$router.push({ name: "Devices" });
      }
    }
  }

  async getDevices() {
    if (this.api.links) {
      await axios.get(this.api.links["self"].href).catch();
    }
  }
}
</script>

<style lang="scss">
@import "../../../../sass/variables.scss";
#settings {
  background-color: #f3f3f3;
  .nav-title {
    padding: 30px 15px 15px 25px;
  }
  .wrapper {
    padding: 0 0 65px;
    background: #f3f3f3;
    .grey-bg-button {
      background-image: linear-gradient(#f7f7f7, #fcfcfc);
      padding: 20px 25px 20px 25px;
      text-align: left;
      span {
        opacity: 0.6;
      }
      p {
        margin: 5px 0 0;
        opacity: 0.6;
      }
    }

    .save-device {
      height: auto;
      margin: 20px 0;
      border-color: $color-yellow;
      color: $color-yellow;
      background-color: transparent;
      width: 85%;
      padding: 12px 0;
      font-size: 1.2rem;
    }
  }
}
</style>
