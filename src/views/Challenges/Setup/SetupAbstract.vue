<template>
    <div id="challengesAbstractSetup">

        <div class="header-template">
            <div class="colored-background green">

                <div class="nav-title">
                    <router-link :to="{name: 'ChallengesOverview', params: {type: 'credit'}}">
                        <span v-if="type === 'credit'">Tegoed vastleggen</span>
                        <span v-else-if="type === 'timezone'">Tijdzone vastleggen</span>
                        <span v-else-if="type === 'nogo'">Nogo vastleggen</span>
                    </router-link>
                </div>

                <div class="setupHeader">
                    <div class="challengeTypeIcon">
                        <img v-if="type === 'credit'" :src="require('@/assets/images/challenges/icn_challenge_timebucket.svg')" />
                        <img v-else-if="type === 'timezone'" :src="require('@/assets/images/challenges/icn_challenge_timezone.svg')" />
                        <img v-else-if="type === 'nogo'" :src="require('@/assets/images/challenges/icn_challenge_nogo.svg')" />
                    </div>

                    <h3>{{headerData.title}}</h3>
                    <p>{{headerData.text}}</p>

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
import {ChallengesState} from "@/store/challenges/types";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

interface HeaderDataInterface {
    text: string | '',
    title: string | ''
}

@Component({
    components:{
        VueSlider
    }
})
export default class Setup extends Vue {
    @State('challenges') challenges!: ChallengesState;
    @Prop() type!: string;
    @Prop() category!: string;

    headerData: HeaderDataInterface = {
        text: "",
        title: ""
    }

    mounted () {

        switch(this.category)
        {
            case "games":
                this.headerData.title = 'Spellen';

                switch(this.type)
                {
                    case "credit":
                        this.headerData.text = 'Bepaal hier hoeveel tijd je aan games wilt besteden';
                        break;

                    case "timezone":
                        this.headerData.text = 'Bepaal hier wanneer je wel of geen tijd aan games wilt besteden';
                        break;

                    case "nogo":
                        this.headerData.text = 'Hiermee geef je aan dat je op geen enkele manier wilt gamen';
                        break;
                }
                break;

            case "social":
                this.headerData.title = 'Sociale Media';

                switch(this.type)
                {
                    case "credit":
                        this.headerData.text = 'Bepaal hier hoeveel tijd je aan sociale media wilt besteden';
                        break;

                    case "timezone":
                        this.headerData.text = 'Bepaal hier wanneer je wel of geen tijd aan sociale media wilt besteden';
                        break;

                    case "nogo":
                        this.headerData.text = 'Hiermee geef je aan dat je op geen enkele manier gebruik wilt maken van sociale media';
                        break;
                }

                break;

            case "dating":
                this.headerData.title = 'Dating';

                switch(this.type)
                {
                    case "credit":
                        this.headerData.text = 'Bepaal hier hoeveel tijd je aan dating wilt besteden';
                        break;

                    case "timezone":
                        this.headerData.text = 'Bepaal hier wanneer je wel of geen tijd aan dating wilt besteden';
                        break;

                    case "nogo":
                        this.headerData.text = 'Hiermee geef je aan dat je op geen enkele manier gebruik wilt maken van dating services';
                        break;
                }

                break;

            case "gamble":
                this.headerData.title = 'Gokken';

                switch(this.type)
                {
                    case "credit":
                        this.headerData.text = 'Bepaal hier hoeveel tijd je aan gokken wilt besteden';
                        break;

                    case "timezone":
                        this.headerData.text = 'Bepaal hier wanneer je wel of geen tijd aan gokken wilt besteden';
                        break;

                    case "nogo":
                        this.headerData.text = 'Hiermee geef je aan dat je op geen enkele manier gebruik wilt maken van online gokken';
                        break;
                }

                break;
        }
    }
}
</script>

<style lang="scss">
    @import "../../../sass/variables";
    #challengesAbstractSetup{
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

        .over-all-footer{
            background-color: $list-background;

            .save-section{
                background-color: $list-background;
                margin-top: -8px;
                padding: 30px 0 30px 0;

                .save-challenge-btn{
                    border-color: $color-blue;
                    color:$color-blue;
                    background-color:transparent;
                    padding:5px 0;
                    font-size:14px;
                    text-transform: uppercase;
                    font-weight: bold;
                    width: 85%;
                    margin:0 auto;
                }
            }

            .contains-container{
                background-color: $challenges-footer-bg;
                margin-top: -8px;
                padding: 50px 0 80px 0;
                clip-path: polygon(0 23%, 100% 0%, 100% 100%, 0% 100%);
                overflow: hidden;
            }
        }
    }
</style>