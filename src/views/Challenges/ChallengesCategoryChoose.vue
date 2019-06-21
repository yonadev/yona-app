<template>
  <div id="ChallengesCategoryChoose" class="header-template">
      <div class="wrapper grey-bg">
          <div class="challenge-header">
              <div class="text">
                  Kies een categorie waar je een tegoed voor wilt vastleggen
              </div>

              <br clear="left"/>
          </div>

          <a @click="chooseCategory('social')">
              <div class="grey-bg-button">
                  <strong>Sociale media</strong>
              </div>
          </a>

          <a @click="chooseCategory('games')">
              <div class="grey-bg-button">
                  <strong>Games</strong>
              </div>
          </a>

          <a @click="chooseCategory('dating')">
              <div class="grey-bg-button">
                  <strong>Dating</strong>
              </div>
          </a>

          <a @click="chooseCategory('gamble')">
              <div class="grey-bg-button">
                  <strong>Gokken</strong>
              </div>
          </a>
      </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Action, State} from "vuex-class";
import {ChallengesState} from "../../store/challenges/types";

@Component({})
export default class ChallengesCategoryChoose extends Vue{

    typeOverview: string = '';

    //Cycle hooks
    mounted () {
        this.typeOverview = this.$route.params.type;
    }

    chooseCategory( category ){
        this.$router.push({'name': 'ChallengesSetup', params: {type: this.typeOverview, category: category }});
    }
}
</script>