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
          <li :class="{'is-active': active_tab === 'credit'}">
            <a @click.prevent="active_tab = 'credit'">
              <div class="tabImage">
                <img :src="require('../../assets/images/challenges/icn_challenge_timebucket.svg')" />
                <div class="counter">2</div>
              </div>
              <div class="tabTitle">
                Tegoed
              </div>
            </a>
          </li>
          <li :class="{'is-active': active_tab === 'timezone'}">
            <a @click.prevent="active_tab = 'timezone'">
              <div class="tabImage">
                <img :src="require('../../assets/images/challenges/icn_challenge_timezone.svg')" />
                <div class="counter">3</div>
              </div>
              <div class="tabTitle">
                Tijdzone
              </div>
            </a>
          </li>
          <li :class="{'is-active': active_tab === 'nogos'}">
            <a @click.prevent="active_tab = 'nogos'">
              <div class="tabImage">
                <img :src="require('../../assets/images/challenges/icn_challenge_nogo.svg')" />
                <div class="counter">1</div>
              </div>
              <div class="tabTitle">
                NO GO
              </div>
            </a>
          </li>
        </ul>
      </div>

    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'credit'">

        <div class="challenge-header">
            <div class="text">
                Stel je zelf een doel door een dagelijks tegoed vast te stellen
            </div>
            <div class="add-button">
                <router-link :to="{name: 'CheckPinCode'}">
                    <img :src="require('../../assets/images/challenges/add_circel.svg')" />
                </router-link>
            </div>

            <br clear="left"/>
        </div>

        <router-link :to="{name: 'CheckPinCode'}">
            <div class="grey-bg-button">
                <strong>Social</strong>
                <p>Je kunt per dag 30 minuten op social media doorbrengen</p>
            </div>
        </router-link>

        <router-link :to="{name: 'CheckPinCode'}">
            <div class="grey-bg-button">
                <strong>Dating</strong>
                <p>Je kunt per dag 20 minuten daten</p>
            </div>
        </router-link>

    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'timezone'">
        <div class="challenge-header">
            <div class="text">
                Bepaal zelf wanneer je wel of niet tijd wilt besteden.
            </div>
            <div class="add-button">
                <router-link :to="{name: 'CheckPinCode'}">
                    <img :src="require('../../assets/images/challenges/add_circel.svg')" />
                </router-link>
            </div>

            <br clear="left"/>
        </div>

        <router-link :to="{name: 'CheckPinCode'}">
            <div class="grey-bg-button">
                <strong>Games</strong>
                <p>Toegestaan tussen 07:00 en 08:00 en tussen 17:00 en 21:00</p>
            </div>
        </router-link>
    </div>
    <div class="wrapper grey-bg" v-if="active_tab === 'nogos'">
        <div class="challenge-header">
            <div class="text">
                Hier leg je vast waar je helemaal niet wilt komen.
            </div>
            <div class="add-button">
                <router-link :to="{name: 'CheckPinCode'}">
                    <img :src="require('../../assets/images/challenges/add_circel.svg')" />
                </router-link>
            </div>

            <br clear="left"/>
        </div>

        <router-link :to="{name: 'CheckPinCode'}">
            <div class="grey-bg-button">
                <strong>Adult</strong>
                <p>Vermijd adult gerelateerde content</p>
            </div>
        </router-link>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'

@Component({})
export default class Add extends Vue {
    active_tab: string = 'credit';

    //Cycle hooks
    mounted () {
    }

    //Computed properties
    get computedMsg () {
        return '';
    }

    //Methods
    methodFunction () {
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