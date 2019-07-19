<template>
  <div id="challenges" class="header-template">
    <div class="colored-background green">

      <div class="nav-title">
        <router-link :to="{name: 'Profile'}">
          {{$t('challenges')}}
        </router-link>
      </div>
      <div class="tabs is-fullwidth" v-fixed-scroll>
        <ul>
            <router-link tag="li" :to="{name: 'ChallengesOverview', params: {type: 'credit'}}" active-class="is-active" :class="{'router-link-exact-active is-active router-link-active': sub.subIsActive(['/challenges/credit/chooseCategory'])}">
                <a>
                    <div class="tabImage">
                        <img :src="require('../../assets/images/challenges/icn_challenge_timebucket.svg')" />
                        <div class="counter" v-if="goalsByType('BudgetGoal').length > 0">{{goalsByType('BudgetGoal').length}}</div>
                    </div>
                    <div class="tabTitle">
                        {{$t('challengescredit')}}
                    </div>
                </a>
            </router-link>
            <router-link tag="li" :to="{name: 'ChallengesOverview', params: {type: 'timezone'}}" active-class="is-active" :class="{'router-link-exact-active is-active router-link-active': sub.subIsActive(['/challenges/timezone/chooseCategory'])}">
                <a>
                    <div class="tabImage">
                        <img :src="require('../../assets/images/challenges/icn_challenge_timezone.svg')" />
                        <div class="counter" v-if="goalsByType('TimeZoneGoal').length > 0">{{goalsByType('TimeZoneGoal').length}}</div>
                    </div>
                    <div class="tabTitle">
                        {{$t('challengeszone')}}
                    </div>
                </a>
            </router-link>
            <router-link tag="li" :to="{name: 'ChallengesOverview', params: {type: 'nogo'}}" active-class="is-active" :class="{'router-link-exact-active is-active router-link-active': sub.subIsActive(['/challenges/nogo/chooseCategory'])}">
                <a>
                    <div class="tabImage">
                        <img :src="require('../../assets/images/challenges/icn_challenge_nogo.svg')" />
                        <div class="counter" v-if="goalsByType('NoGoGoal').length > 0">{{goalsByType('NoGoGoal').length}}</div>
                    </div>
                    <div class="tabTitle">
                        {{$t('challengesnogo')}}
                    </div>
                </a>
            </router-link>
        </ul>
      </div>

    </div>

      <div class="wrapper grey-bg">

          <router-view></router-view>

      </div>

  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import axios from "@/utils/axios/axios";
import subActive from '@/utils/router/subActive'
import {Action, Getter, State} from "vuex-class";
import {ApiState} from "@/store/api/types";
import {Goal} from "@/store/challenges/types";

@Component({})
export default class Add extends Vue {
    @State('api') api!: ApiState;

    @Getter('goalsByType', {namespace: 'challenges'})
    public goalsByType!: (type: string) => Goal[];
    sub = subActive;

}
</script>

<style lang="scss">
    @import "../../sass/variables";
    #challenges{
        ul{
            li{
                a{
                    display: block;
                    .tabImage{
                        width: 100%;
                        position: relative;

                        img{
                            max-height: 42px;
                        }

                        .counter{
                            position: absolute;
                            top: 0;
                            right: 50%;
                            margin-right: -32px;
                            border: 1px solid #FFF;
                            background-color: $color-green;
                            padding: 3px 7px;
                            border-radius: 15px;
                            text-align: center;
                        }
                    }

                    .tabTitle{
                        width: 100%;
                        position: relative;
                        padding-top: 10px;
                    }
                }
            }
        }
    }
</style>