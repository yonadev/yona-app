<template>
    <Component
        :is="getSetup()"></Component>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator'

import ChallengesSetupCredit from './SetupCredit.vue'
import ChallengesSetupTimezone from './SetupTimezone.vue'
import ChallengesSetupNogo from './SetupNogo.vue'

@Component({})

export default class ChallengesSetup extends Vue {
    @Prop() type!: string;

    getSetup() {
        switch(this.type) {
            case "credit" :
                return ChallengesSetupCredit;
            case "timezone" :
                return ChallengesSetupTimezone;
            case "nogo" :
                return ChallengesSetupNogo;
        }
    }
}
</script>