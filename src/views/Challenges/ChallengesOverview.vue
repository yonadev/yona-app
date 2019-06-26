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
import {Action, State} from "vuex-class";
import {ChallengesState} from "@/store/challenges/types";

@Component({})
export default class Add extends Vue{
    @State('challenges') challenges!: ChallengesState;
    @Action('setSetupType', {namespace: 'challenges'}) setSetupType: any;
    @Action('setCategory', {namespace: 'challenges'}) setCategory: any;

    typeOverview: string = '';

    //Cycle hooks
    mounted () {
        this.typeOverview = this.$route.params.type;
        this.fetchChallenges();
    }

    //Methods
    chooseSetup () {
        this.$router.push({name: 'ChallengesCategoryChoose'});
    }

    chooseCategory( category: any ){
        this.setCategory({
            category: category
        });

        this.$router.push({'name': 'ChallengesSetup'});
    }

    beforeRouteUpdate(to: any, from: any, next: any) {
        console.log('beforeRouteUpdate');
        next();

        this.typeOverview = this.$route.params.type;
        this.fetchChallenges();
    }

    fetchChallenges(){
        console.log('fetch '+this.typeOverview+' challenges')
    }
}
</script>