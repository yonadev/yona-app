<template>
    <div id="challengesSetup">

        <div class="wrapper grey-bg" v-if="challenges.setupType === 'credit'">

            <div class="slider-container">
                <div class="columns is-mobile">
                    <div class="column creditColumn">
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

        <div class="wrapper save-section">

            <div class="slider-container">

                <a class="button is-rounded is-fullwidth add-friend">Challenge opslaan</a>

            </div>

            <div class="slider-container contains-container">

                <p>De volgende apps zijn onderdeel van deze challenge:</p><br />
                <p class="apps">Whatsapp, Facebook, Twitter, Pinterest, Instagram, Snapchat</p>

            </div>

        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'
import {State} from "vuex-class";
import {ChallengesState} from "../../../store/challenges/types";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

@Component({
    components:{
        VueSlider
    }
})
export default class Setup extends Vue {
    @State('challenges') challenges!: ChallengesState;
    //@Prop() msg: string = '';
    setupData: Object = {
        title: '',
        text: '',
        credit: {
            amount: 30
        }
    };

    sliderOption: Object = {
        min: 0,
        max: 240,
        tooltip: 'none'
    };

    //Cycle hooks
    mounted () {
        switch(this.challenges.setupCategory)
        {
            case "games":
                this.setupData.title = 'Spellen';
                this.setupData.text = 'Bepaal hier hoeveel tijd je aan games wilt besteden';
                break;

            case "social":
                this.setupData.title = 'Sociale Media';
                this.setupData.text = 'Bepaal hier hoeveel tijd je aan sociale media wilt besteden';
                break;

            case "dating":
                this.setupData.title = 'Dating';
                this.setupData.text = 'Bepaal hier hoeveel tijd je aan dating wilt besteden';
                break;

            case "gamble":
                this.setupData.title = 'Gokken';
                this.setupData.text = 'Bepaal hier hoeveel tijd je aan gokken wilt besteden';
                break;
        }
    }
}
</script>

<style lang="scss">
    @import "../../../sass/variables";
    #challengesSetup{
        .setupHeader{
            width: 200px;
            margin: 0 auto;
            padding-bottom: 20px;
            color: #FFF;
            p{
                margin-top: -10px;
            }
            .challengeTypeIcon{
                background-color: #8cb818;
                width: 100px;
                height: 100px;
                display: block;
                position: relative;
                margin: 0 auto;
                border-radius: 50px;

                img {
                    position: absolute;
                    top: 25px;
                    left: 26px;
                }
            }
        }

        .slider-container{
            padding: 30px;
            background-image: linear-gradient($list-item-gradient-two, $list-item-gradient-one);

            .creditColumn{
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

            &.contains-container{
                background-color: #e7e7e7 !important;
                background-image: none;
                clip-path: polygon(0 20%, 100% 0%, 100% 100%, 0% 100%);
            }
        }

        .add-friend{
            border-color: $color-blue;
            color:$color-blue;
            background-color:transparent;
            padding:5px 0;
            font-size:14px;
            text-transform: uppercase;
            font-weight: bold;
        }
    }
</style>