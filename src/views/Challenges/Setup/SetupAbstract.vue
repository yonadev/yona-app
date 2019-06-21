<template>
    <div id="challengesSetup">

        <div class="header-template">
            <div class="colored-background green">

                <div class="nav-title">
                    <router-link :to="{name: 'ChallengesTabs'}">
                        <span v-if="challenges.setupType === 'credit'">Tegoed vastleggen</span>
                    </router-link>
                </div>

                <div class="setupHeader">

                    <div class="challengeTypeIcon">
                        <img :src="require('../../../assets/images/challenges/icn_challenge_timebucket.svg')" />
                    </div>

                    <h3>{{setupData.title}}</h3>
                    <p>{{setupData.text}}</p>

                </div>


            </div>
        </div>

        <router-view></router-view>

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
    };

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
    }
</style>