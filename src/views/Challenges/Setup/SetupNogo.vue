<template>
    <div id="challengesSetup">
        <div class="wrapper save-section">

            <div class="slider-container">

                <a class="button is-rounded is-fullwidth save-challenge-btn">Challenge opslaan</a>

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
import {State} from "vuex-class";
import {ChallengesState} from "@/store/challenges/types";

@Component({})
export default class Setup extends Vue {
    @State('challenges') challenges!: ChallengesState;
    //@Prop() msg: string = '';

    sliderOption: Object = {
        min: 0,
        max: 240,
        tooltip: 'none'
    };

    //Cycle hooks
    mounted () {

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

        .save-challenge-btn{
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