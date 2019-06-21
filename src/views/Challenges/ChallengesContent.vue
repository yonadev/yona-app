<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({})
export default class ChallengesContent extends Vue{


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