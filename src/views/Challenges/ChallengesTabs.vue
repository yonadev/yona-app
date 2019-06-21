<template>
  <div id="challenges" class="header-template">
    <div class="colored-background green">

      <div class="nav-title">
        <router-link :to="{name: 'Profile'}">
          CHALLENGES
        </router-link>
      </div>

      <div class="tabs is-fullwidth">
        <ul>
            <router-link tag="li" :to="{name: 'ChallengesOverview', params: {type: 'credit'}}" active-class="is-active" :class="{'router-link-exact-active is-active router-link-active': sub.subIsActive(['/challenges/credit/chooseCategory'])}">
                <a>
                    <div class="tabImage">
                        <img :src="require('../../assets/images/challenges/icn_challenge_timebucket.svg')" />
                        <div class="counter">2</div>
                    </div>
                    <div class="tabTitle">
                        Tegoed
                    </div>
                </a>
            </router-link>
            <router-link tag="li" :to="{name: 'ChallengesOverview', params: {type: 'timezone'}}" active-class="is-active" :class="{'router-link-exact-active is-active router-link-active': sub.subIsActive(['/challenges/timezone/chooseCategory'])}">
                <a>
                    <div class="tabImage">
                        <img :src="require('../../assets/images/challenges/icn_challenge_timezone.svg')" />
                        <div class="counter">3</div>
                    </div>
                    <div class="tabTitle">
                        Tijdzone
                    </div>
                </a>
            </router-link>
            <router-link tag="li" :to="{name: 'ChallengesOverview', params: {type: 'nogo'}}" active-class="is-active" :class="{'router-link-exact-active is-active router-link-active': sub.subIsActive(['/challenges/nogo/chooseCategory'])}">
                <a>
                    <div class="tabImage">
                        <img :src="require('../../assets/images/challenges/icn_challenge_nogo.svg')" />
                        <div class="counter">1</div>
                    </div>
                    <div class="tabTitle">
                        NO GO
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
import subActive from '../../utils/router/subActive'
//import {Prop, Watch} from 'vue-property-decorator'
//import {Action, State} from "vuex-class";
//import {ChallengesState} from "../../store/challenges/types";

@Component({})
export default class Add extends Vue {

    //@State('challenges') challenges!: ChallengesState;
    //@Action('setSetupType', {namespace: 'challenges'}) setSetupType: any;
    //@Action('setCategory', {namespace: 'challenges'}) setCategory: any;

    sub = subActive;

    //Cycle hooks
    mounted () {
        subActive.subIsActive(['/wqdwed'])
    }

    beforeRouteUpdate(to, from, next) {
        console.log('beforeRouteUpdate')
        next() // needs to be called to confirm the navigation
    }

    beforeRouteEnter(to, from, next) {
        console.log('beforeRouteEnter')
        next() // needs to be called to confirm the navigation
    }

    beforeRouteLeave(to, from, next) {
        console.log('beforeRouteLeave')
        next() // needs to be called to confirm the navigation
    }
}
</script>

<style lang="scss">
    @import "../../sass/variables";
    #challenges{

        .wrapper{
            padding:0;

            .challenge-header{
                padding:20px 0 20px 25px;
                text-align: left;
                position: relative;
                max-width: 100%;
                width: 100%;
                background-color: $list-background;

                .text{
                    float: left;
                    width: 65%;
                    padding-top: 10px;
                }

                .add-button{
                    float: left;
                    width: 35%;

                    a{
                        display: block;
                    }
                }
            }

            .grey-bg-button{
                background-image: linear-gradient($list-item-gradient-two, $list-item-gradient-one);
                padding:20px 25px 20px 25px;
                text-align: left;
            }
        }

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
                            left: 50px;
                            border: 1px solid #FFF;
                            background-color: $color-green;
                            padding: 3px 4px;
                            border-radius: 15px;
                            min-width: 20px;
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