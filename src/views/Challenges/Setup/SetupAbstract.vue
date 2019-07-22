<template>
    <div id="challengesAbstractSetup">

        <div class="header-template">
            <div class="colored-background green">
                <div class="nav-title">
                    <span>{{title}}</span>
                    <a @click="deleteG" v-if="goal_url && goal(goal_url)._links.edit">
                        <img class="small-top-icon is-pulled-right" :src="require('@/assets/images/icons/icn_trash.svg')" />
                    </a>
                </div>

                <div class="setupHeader">
                    <div class="challengeTypeIcon">
                        <img :src="icon" />
                    </div>

                    <h3>{{activityCategory(category).name}}</h3>
                    <p>{{headerText}}</p>

                </div>

            </div>
        </div>

        <router-view></router-view>

        <div class="wrapper over-all-footer">

            <div class="wrapper contains-container">
                <div class="columns is-mobile">
                    <div class="column is-three-fifths is-offset-one-fifth">
                        <p>{{activityCategory(category).description}}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'
import {Action, Getter, State} from "vuex-class";
import {ActivityCategory, ChallengesState, Goal} from "@/store/challenges/types";
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
    @Prop() goal_url!: string;

    @Action('deleteGoal', {namespace: 'challenges'}) deleteGoal: any;

    @Getter('activityCategory', {namespace: 'challenges'})
    public activityCategory!: (href: string) => ActivityCategory;

    @Getter('goal', {namespace: 'challenges'})
    public goal!: (href: string) => Goal;

    headerData: HeaderDataInterface = {
        text: "",
        title: ""
    }

    get headerText(): any {
        switch(this.type)
        {
            case "credit":
                return this.$t('budgetgoalheadersubtext', {category: this.activityCategory(this.category).name});

            case "timezone":
                return this.$t('timezonegoalheadersubtext', {category: this.activityCategory(this.category).name});

            case "nogo":
                return this.$t('nogoheadersubtext');
        }

        return '';
    }

    get title(): any {
        switch(this.type)
        {
            case "credit":
                return this.$t('challengesdetail', {type: this.$t('challengescredit')});

            case "timezone":
                return this.$t('challengesdetail', {type: this.$t('challengeszone')});

            case "nogo":
                return this.$t('challengesdetail', {type: this.$t('challengesnogo')});
        }

        return '';
    }

    get icon(): any {
        switch(this.type)
        {
            case "credit":
                return require('@/assets/images/challenges/icn_challenge_timebucket.svg');

            case "timezone":
                return require('@/assets/images/challenges/icn_challenge_timezone.svg');

            case "nogo":
                return require('@/assets/images/challenges/icn_challenge_nogo.svg');
        }

        return '';
    }

    async deleteG() {

        const goal = this.goal(this.goal_url);

        if(goal._links.edit) {
            await this.deleteGoal(goal._links.edit.href)
            this.$router.push({name: 'ChallengesOverview', params: {type: this.type}})
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
