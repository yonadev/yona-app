<template>
    <div id="challengesSetup">
        <div class="wrapper save-section">

            <div class="wrapper over-all-footer">
                <div class="wrapper grey-bg save-section">

                    <a class="button is-rounded is-fullwidth save-challenge-btn" v-if="!goal" @click="save()" :disabled="loading">Challenge opslaan</a>

                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Action, State} from "vuex-class";
import {BudgetGoal, ChallengesState, Goal} from "@/store/challenges/types";
import {Prop} from "vue-property-decorator";

@Component({})
export default class Setup extends Vue {
    @Action('saveGoal', {namespace: 'challenges'}) saveGoal: any;
    @Prop() category!: string;
    @Prop() goal!: BudgetGoal;

    loading: boolean = false;

    async save() {
        this.loading = true;
        await this.saveGoal({
            '@type': 'BudgetGoal',
            _links: {
                'yona:activityCategory' : {
                    href: this.category
                }
            },
            maxDurationMinutes: 0
        })
        this.$router.push({name: 'ChallengesOverview', params: {type: 'nogo'}})
    }
}
</script>