<template>
    <div id="challengesCreditSetup">

        <div class="wrapper grey-bg">
            <div class="slider-container">
                <div class="columns is-mobile">
                    <div class="column challengeInfoColumn">
                        <strong>{{$t('budgetgoaltitle')}}</strong>
                        <p>{{$t('budgetgoaldesc')}}</p>
                    </div>
                    <div class="column is-one-third creditAmountColumn">
                        <span>{{setupData.maxDurationMinutes}}</span>
                    </div>
                </div>
                <VueSlider v-model="setupData.maxDurationMinutes" v-bind="sliderOption" class="challenge-slider"></VueSlider>
            </div>
        </div>

        <div class="wrapper over-all-footer">
            <div class="wrapper grey-bg save-section">
                <a class="button is-rounded is-fullwidth save-challenge-btn" @click="save()" :disabled="setupData.maxDurationMinutes == 0 || loading">{{$t('challenges.addBudgetGoal.setChallengeButton')}}</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Action, State} from "vuex-class";
import {BudgetGoal, ChallengesState, Goal} from "@/store/challenges/types";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import {Prop} from "vue-property-decorator";

@Component({
    components:{
        VueSlider
    }
})
export default class Setup extends Vue {
    @Action('saveGoal', {namespace: 'challenges'}) saveGoal: any;
    @Action('updateGoal', {namespace: 'challenges'}) updateGoal: any;
    @Prop() category!: string;
    @Prop() goal!: BudgetGoal;

    setupData: {
        maxDurationMinutes: number
    } = {
        maxDurationMinutes: 0
    };

    sliderOption: Object = {
        min: 0,
        max: 240,
        tooltip: 'none'
    };

    loading: boolean = false;

    mounted () {
        if(this.goal) {
            this.setupData.maxDurationMinutes = this.goal.maxDurationMinutes;
        }
    }

    async save() {
        this.loading = true;
        if(this.goal && this.goal._links.edit) {
            await this.updateGoal({
                url: this.goal._links.edit.href,
                data: {
                    '@type': 'BudgetGoal',
                    _links: {
                        'yona:activityCategory': {
                            href: this.category
                        }
                    },
                    maxDurationMinutes: this.setupData.maxDurationMinutes
                }
            })
        } else {
            await this.saveGoal({
                '@type': 'BudgetGoal',
                _links: {
                    'yona:activityCategory': {
                        href: this.category
                    }
                },
                maxDurationMinutes: this.setupData.maxDurationMinutes
            })
        }
        this.$router.push({name: 'ChallengesOverview', params: {type: 'credit'}})
    }

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