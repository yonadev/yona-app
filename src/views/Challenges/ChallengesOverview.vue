<template>
  <div id="challenges" class="header-template">
      <div class="wrapper grey-bg">

          <div class="challenge-header">
              <div class="text">
                  Stel je zelf een doel door een dagelijks tegoed vast te stellen
              </div>
              <div class="add-button">
                  <a @click="chooseSetup()">
                      <img :src="require('@/assets/images/challenges/add_circel.svg')" />
                  </a>
              </div>

              <br clear="left"/>
          </div>

          <challenges-label v-for="(goal, index) in goals" :key="index" :goal="goal"></challenges-label>

          <div class="grey-bg-button">
              <strong>Social</strong>
              <p>Je kunt per dag 30 minuten op social media doorbrengen</p>
          </div>

          <div class="grey-bg-button">
              <strong>Dating</strong>
              <p>Je kunt per dag 20 minuten daten</p>
          </div>

      </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import axios from "@/utils/axios/axios";
import {Action, State} from "vuex-class";
import {ApiState} from "@/store/api/types";
import {Prop} from 'vue-property-decorator'
import {ChallengesState} from "@/store/challenges/types";

import ChallengesLabel from "@/components/Challenges/ChallengesLabel.vue";

@Component({
    components: {ChallengesLabel}
})
export default class Add extends Vue{
    @State('challenges') challenges!: ChallengesState;
    @State('api') api!: ApiState;
    @Prop() type!: string;
    @Action('setSetupType', {namespace: 'challenges'}) setSetupType: any;

    goalType: string = '';
    goals!: any = null;

    //Cycle hooks
    mounted () {
        this.goalType = this.type;
        this.fetchGoals();
    }

    //Methods
    chooseSetup () {
        this.$router.push({name: 'ChallengesCategoryChoose'});
    }

    chooseCategory( category: any ){
        this.$router.push({'name': 'ChallengesSetup'});
    }

    beforeRouteUpdate(to: any, from: any, next: any) {
        this.goalType = to.params.type;
        next()
    }

    async fetchGoals(){

        if(this.api.embedded['yona:goals'] &&
            this.api.embedded['yona:goals']._embedded &&
            this.api.embedded['yona:goals']._embedded['yona:goals']) {
            this.goals = this.api.embedded['yona:goals']._embedded['yona:goals']
        }
    }
}
</script>