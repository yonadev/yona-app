<template>
  <div id="challengesTimezoneSetup" :loading="loading">
    <div class="wrapper grey-bg">
      <div class="timezones-container">
        <div class="columns is-mobile">
          <div class="column challengeInfoColumn">
            <strong>{{ $t("timezone") }}</strong>
            <p>{{ $t("timezonegoalsubtext") }}</p>
          </div>
          <div class="column is-one-fifth add-tz-btn">
            <a @click="addTimezoneEntry()">
              <img
                :src="require('@/assets/images/challenges/add_circel.svg')"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper grey-bg">
      <div class="timezone-entries">
        <swipe-list ref="list" :items="setupData.items" item-key="id">
          <template v-slot="{ item, index }">
            <div
              ref="content"
              class="item-wrapper"
              @click="editTimezoneEntry(item)"
            >
              <div class="item-inner">
                <div class="item-slot">
                  <img :src="require('@/assets/images/icons/icn_bounds.svg')" />
                </div>
                <div class="item-time-from">
                  <label :for="'timeFrom' + index">
                    <div class="time-entry-content">
                      <div class="label">{{ $t("from") }}</div>
                      <div class="time-value">{{ item.from }}</div>
                    </div>
                  </label>
                </div>
                <div class="item-time-end">
                  <label :for="'timeTo' + index">
                    <div class="time-entry-content">
                      <div class="label">{{ $t("to") }}</div>
                      <div class="time-value">{{ item.to }}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:right="{ item }">
            <div class="item-delete">
              <a @click="deleteTimezoneEntry(item)">
                <img :src="require('@/assets/images/icons/icn_trash.svg')" />
              </a>
            </div>
          </template>
        </swipe-list>
      </div>
    </div>

    <div class="wrapper over-all-footer">
      <div class="wrapper grey-bg save-section">
        <a
          class="button is-rounded is-fullwidth save-challenge-btn"
          :disabled="setupData.items.length == 0 || loading"
          @click="save"
        >
          {{ $t("challenges.addBudgetGoal.setChallengeButton") }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action } from "vuex-class";
import { TimeZoneGoal } from "@/store/challenges/types";

//@ts-ignore
import { SwipeList, SwipeOut } from "vue-swipe-actions";
import { Prop } from "vue-property-decorator";

interface timeEntry {
  id: number;
  from: string;
  to: string;
  swiped: boolean;
}

@Component({
  components: { SwipeList, SwipeOut }
})
export default class Setup extends Vue {
  @Action("saveGoal", { namespace: "challenges" }) saveGoal: any;
  @Action("updateGoal", { namespace: "challenges" }) updateGoal: any;
  @Prop() category!: string;
  @Prop() goal!: TimeZoneGoal;
  loading: boolean = false;

  setupData: {
    items: timeEntry[];
  } = {
    items: []
  };

  mounted() {
    if (this.goal) {
      this.setupData.items = this.goal.zones.map(zone => {
        return {
          id: Math.random(),
          from: zone.split("-")[0],
          to: zone.split("-")[1],
          swiped: false
        };
      });
    }
  }

  async addTimezoneEntry() {
    const response = await this.openTimePicker(null, null);

    this.setupData.items.push({
      id: Math.random(),
      from: response.startTime,
      to: response.endTime,
      swiped: false
    });
  }

  async editTimezoneEntry(item: timeEntry) {
    const response = await this.openTimePicker(item.from, item.to);
    item.from = response.startTime;
    item.to = response.endTime;
  }

  openTimePicker(
    startTime: string | null,
    endTime: string | null
  ): Promise<{ startTime: string; endTime: string }> {
    return new Promise(resolve => {
      if (
        //@ts-ignore
        typeof cordova !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins !== "undefined" &&
        //@ts-ignore
        typeof cordova.plugins.TimePicker !== "undefined"
      ) {
        //@ts-ignore
        cordova.plugins.TimePicker.pick(
          {
            startTime,
            endTime
          },
          resolve
        );
      } else {
        resolve({ startTime: "00:00", endTime: "04:00" });
      }
    });
  }

  deleteTimezoneEntry(entry: timeEntry) {
    this.setupData.items.splice(this.setupData.items.indexOf(entry), 1);
  }

  async save() {
    let saved = false;

    if (this.loading || this.setupData.items.length == 0) {
      return false;
    }

    this.loading = true;

    const data = {
      "@type": "TimeZoneGoal",
      _links: {
        "yona:activityCategory": {
          href: this.category
        }
      },
      zones: this.setupData.items.map(zone => {
        return `${zone.from}-${zone.to}`;
      })
    };

    if (this.goal && this.goal._links.edit) {
      saved = await this.updateGoal({
        url: this.goal._links.edit.href,
        data
      });
    } else {
      saved = await this.saveGoal(data);
    }

    if (saved) {
      this.$router.push({
        name: "ChallengesOverview",
        params: { type: "timezone" }
      });
    } else {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
@import "../../../sass/variables";
@import "~vue-swipe-actions/src/styles/vue-swipe-actions.css";
#challengesTimezoneSetup {
  .timezones-container {
    padding: 30px;
    background-color: #f3f3f3;

    .challengeInfoColumn {
      text-align: left;
      strong {
        font-size: 14px;
      }
      p {
        margin-top: 4px;
      }
    }

    .add-tz-btn {
      font-size: 30px;
      text-align: right;
    }
  }

  .timezone-entries {
    background-color: #f3f3f3;
    margin-bottom: 8px;
    .swipeout-list {
      max-width: 100%;
      width: 100%;
      .swipeout-list-item {
        background-image: linear-gradient(#fcfcfc, #f7f7f7);
        height: 80px;
        width: 100%;
        display: block;
        position: relative;
        flex: none;

        .item-slot {
          width: 25%;
          float: left;
          display: inline-block;
          border-right: 1px solid #f3f3f3;
          box-sizing: border-box;

          img {
            color: #f3f3f3;
            width: 24px;
            margin-top: 27px;
          }
        }
        .item-time-from,
        .item-time-end {
          width: 37.5%;
          float: left;
          display: inline-block;
          border-right: 1px solid #f3f3f3;
          box-sizing: border-box;

          .time-entry-content {
            .label {
              color: #a8a8a8;
              width: 100%;
              padding: 8px 0 0 10px;
              text-align: left;
              font-size: 16px;
              text-transform: uppercase;
            }

            .time-value {
              width: 100%;
              font-size: 32px;
              text-align: left;
              padding-left: 10px;
              font-family: Oswald, sans-serif;
            }
          }
        }

        .item-time-end {
          border: none;
        }

        .swipeout-right {
          width: 25%;

          .item-delete {
            text-align: center;
            background-color: $color-purple;
            width: 100%;
            a {
              display: block;

              img {
                color: #f3f3f3;
                width: 24px;
                margin-top: 27px;
              }
            }
          }
        }
      }
    }
  }

  .vdatetime-popup__header {
    background: $color-green;
    .vdatetime-popup__title {
      text-transform: uppercase;
    }
  }
  .vdatetime-time-picker__item--selected {
    color: $color-green;
  }
  .vdatetime-popup__actions__button {
    color: $color-blue;
  }
}
</style>
