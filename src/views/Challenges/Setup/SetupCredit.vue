<template>
    <div id="challengesCreditSetup">

        <div class="wrapper grey-bg">
            <div class="slider-container">
                <div class="columns is-mobile">
                    <div class="column challengeInfoColumn">
                        <strong>Tegoed</strong>
                        <p>minuten tegoed per dag</p>
                    </div>
                    <div class="column is-one-third creditAmountColumn">
                        <span>{{setupData.credit.amount}}</span>
                    </div>
                </div>

                <VueSlider v-model="setupData.credit.amount" v-bind="sliderOption" class="challenge-slider"></VueSlider>
            </div>
        </div>

        <div class="wrapper over-all-footer">
            <div class="wrapper grey-bg save-section">
                <a class="button is-rounded is-fullwidth save-challenge-btn">Challenge opslaan</a>
            </div>

            <div class="wrapper contains-container">
                <div class="columns is-mobile">
                    <div class="column is-three-fifths is-offset-one-fifth">
                        <p>De volgende apps zijn onderdeel van deze challenge:</p><br />
                        <p class="apps">Whatsapp, Facebook, Twitter, Pinterest, Instagram, Snapchat</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {ChallengesState} from "@/store/challenges/types";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

@Component({
    components:{
        VueSlider
    }
})
export default class Setup extends Vue {
    @State('challenges') challenges!: ChallengesState;
    setupData: {
        credit: {
            amount: number
        }
    } = {
        credit: {
            amount: 30
        }
    };

    sliderOption: Object = {
        min: 0,
        max: 240,
        tooltip: 'none'
    };
}
</script>

<style lang="scss">
    @import "../../../sass/variables";
    #challengesCreditSetup{
        .slider-container{
            padding: 30px;
            background-image: linear-gradient($list-item-gradient-two, $list-item-gradient-one);

            .challengeInfoColumn{
                text-align: left;
                strong{
                    font-size: 14px;
                }
                p{
                    margin-top: 4px;
                }
            }

            .creditAmountColumn{
                font-size: 30px;
                text-align: right;
            }

            .challenge-slider{
                margin-top: -8px;

                .vue-slider-process{
                    background-color: #95c11f;
                }

                .vue-slider-rail{
                    background-color: #e7e7e7;
                }

                .vue-slider-dot{
                    width: 18px !important;
                    height: 18px !important;
                    .vue-slider-dot-handle{
                        background-color: #95c11f;
                        border: 2px solid #95c11f;
                    }
                }

            }
        }
    }
</style>