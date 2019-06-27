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
import {Prop} from 'vue-property-decorator'

@Component({})
export default class ChallengesCategoryChoose extends Vue{
    @Prop() type!: string

    chooseCategory( category: any ){
        this.$router.push({'name': 'ChallengesSetup', params: { category: category, type: this.type }});
    }
}
</script>