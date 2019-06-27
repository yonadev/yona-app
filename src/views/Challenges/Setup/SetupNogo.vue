<template>
    <div id="challengesSetup">
        <div class="wrapper save-section">

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