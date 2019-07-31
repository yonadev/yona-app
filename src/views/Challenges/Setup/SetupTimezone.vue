<template>
  <div id="challengesTimezoneSetup">
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
            <div ref="content" class="item-wrapper">
              <div class="item-inner">
                <div class="item-slot">
                  <img :src="require('@/assets/images/icons/icn_bounds.svg')" />
                </div>
                <div class="item-time-from">
                  <label :for="'timeFrom' + index">
                    <div class="time-entry-content">
                      <div class="label">{{ $t("from") }}</div>
                      <div class="time-value">{{ formatTime(item.from) }}</div>
                    </div>
                  </label>
                </div>
                <div class="item-time-end">
                  <label :for="'timeTo' + index">
                    <div class="time-entry-content">
                      <div class="label">{{ $t("to") }}</div>
                      <div class="time-value">{{ formatTime(item.to) }}</div>
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
        <div v-for="(item, index) in setupData.items" :key="'dateTime' + index">
          <datetime
            v-model="item.from"
            :input-id="'timeFrom' + index"
            type="time"
            :minute-step="15"
            format="HH:mm"
            value-zone="UTC+2"
            input-style="display:none;"
            :title="$t('from')"
          >
            <template slot="button-cancel">
              {{ $t("cancel") }}
            </template>
            <template slot="button-confirm">
              <label :for="'timeTo' + index">
                {{ $t("next") }}
              </label>
            </template>
          </datetime>
          <datetime
            v-model="item.to"
            :input-id="'timeTo' + index"
            type="time"
            :minute-step="15"
            format="HH:mm"
            value-zone="UTC+2"
            input-style="display:none;"
            :title="$t('to')"
          >
            <template slot="button-cancel">
              {{ $t("cancel") }}
            </template>
            <template slot="button-confirm">
              {{ $t("save") }}
            </template>
          </datetime>
        </div>
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
import { Action, State } from "vuex-class";
import { ChallengesState, Goal, TimeZoneGoal } from "@/store/challenges/types";

//@ts-ignore
import { Datetime } from "vue-datetime";
//@ts-ignore
import { DateTime } from "luxon";
import "vue-datetime/dist/vue-datetime.css";

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
  components: { SwipeList, SwipeOut, Datetime, DateTime }
})
export default class Setup extends Vue {
  @Action("saveGoal", { namespace: "challenges" }) saveGoal: any;
  @Action("updateGoal", { namespace: "challenges" }) updateGoal: any;
  @Prop() category!: string;
  @Prop() goal!: TimeZoneGoal;
  loading = false;

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

  formatTime(time: string) {
    let timeFormat = DateTime.fromISO(time);
    return timeFormat.toFormat("HH:mm");
  }

  addTimezoneEntry() {
    this.setupData.items.push({
      id: Math.random(),
      from: "00:00",
      to: "00:00",
      swiped: false
    });
  }

  deleteTimezoneEntry(entry: timeEntry) {
    this.setupData.items.splice(this.setupData.items.indexOf(entry), 1);
  }

  async save() {
    this.loading = true;

    if (this.goal && this.goal._links.edit) {
      await this.updateGoal({
        url: this.goal._links.edit.href,
        data: {
          "@type": "TimeZoneGoal",
          _links: {
            "yona:activityCategory": {
              href: this.category
            }
          },
          zones: this.setupData.items.map(zone => {
            return `${DateTime.fromISO(zone.from).toFormat(
              "HH:mm"
            )}-${DateTime.fromISO(zone.to).toFormat("HH:mm")}`;
          })
        }
      });
    } else {
      await this.saveGoal({
        "@type": "TimeZoneGoal",
        _links: {
          "yona:activityCategory": {
            href: this.category
          }
        },
        zones: this.setupData.items.map(zone => {
          return `${DateTime.fromISO(zone.from).toFormat(
            "HH:mm"
          )}-${DateTime.fromISO(zone.to).toFormat("HH:mm")}`;
        })
      });
    }
    this.$router.push({
      name: "ChallengesOverview",
      params: { type: "timezone" }
    });
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
