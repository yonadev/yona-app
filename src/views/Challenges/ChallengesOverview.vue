<template>
  <div id="challenges" class="header-template">
      <div class="wrapper grey-bg">

          <div class="challenge-header">
              <div class="text">
                  Stel je zelf een doel door een dagelijks tegoed vast te stellen
              </div>
              <div class="add-button">
                  <a @click="chooseSetup('credit')">
                      <img :src="require('../../assets/images/challenges/add_circel.svg')" />
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
import {ChallengesState} from "../../store/challenges/types";

@Component({})
export default class Add extends Vue{

    @State('challenges') challenges!: ChallengesState;
    @Action('setSetupType', {namespace: 'challenges'}) setSetupType: any;
    @Action('setCategory', {namespace: 'challenges'}) setCategory: any;

    typeOverview: string = '';
    setupActive: boolean = false;

    //Cycle hooks
    mounted () {
        this.typeOverview = this.$route.params.type;
    }

    //Methods
    chooseSetup ( setupType ) {
        this.$router.push({name: 'ChallengesCategoryChoose'});
    }

    chooseCategory( category ){
        this.setCategory({
            category: category
        });

        this.$router.push({'name': 'ChallengesSetup'});
    }
}
</script>

<style lang="scss">
    @import "../../sass/variables";
    #challenges{

        .wrapper{
            padding:0;

            .challenge-header{
                padding:20px 0 20px 25px;
                text-align: left;
                position: relative;
                max-width: 100%;
                width: 100%;
                background-color: $list-background;

                .text{
                    float: left;
                    width: 65%;
                    padding-top: 10px;
                }

                .add-button{
                    float: left;
                    width: 35%;

                    a{
                        display: block;
                    }
                }
            }

            .grey-bg-button{
                background-image: linear-gradient($list-item-gradient-two, $list-item-gradient-one);
                padding:20px 25px 20px 25px;
                text-align: left;
            }
        }

        ul{
            li{
                a{
                    display: block;
                    .tabImage{
                        width: 100%;
                        position: relative;

                        img{
                            max-height: 42px;
                        }

                        .counter{
                            position: absolute;
                            top: 0;
                            left: 50px;
                            border: 1px solid #FFF;
                            background-color: $color-green;
                            padding: 3px 4px;
                            border-radius: 15px;
                            min-width: 20px;
                            text-align: center;
                        }
                    }

                    .tabTitle{
                        width: 100%;
                        position: relative;
                        padding-top: 10px;
                    }
                }
            }
        }
    }
</style>