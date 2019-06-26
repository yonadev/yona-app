<template>
    <div id="challengesTimezoneSetup">

        <div class="wrapper grey-bg">

            <div class="timezones-container">
                <div class="columns is-mobile">
                    <div class="column challengeInfoColumn">
                        <strong>Tijdzone</strong>
                        <p>waarbinnen gebruik is toegestaan</p>
                    </div>
                    <div class="column is-one-fifth creditAmountColumn">
                        <a @click="addTimezoneEntry()">
                            <img :src="require('@/assets/images/challenges/add_circel.svg')" />
                        </a>
                    </div>
                </div>

            </div>

        </div>

        <div class="wrapper grey-bg">

            <div class="timezone-entries">

                <!--<div class="item-wrapper" v-for="entry in setupData.items" :key="entry.id" v-touch:swipe.left="showDelete(entry)">-->
                <div class="item-wrapper" v-for="entry in setupData.items" :key="entry.id">
                    <div class="item-inner">

                        <div class="item-inner-wrapper">
                            <div class="item-slot">

                                <img :src="require('@/assets/images/icons/icn_bounds.svg')" />

                            </div>
                            <div class="item-time-from">
                                <div class="time-entry-content">
                                    <div class="label">van</div>
                                    <div class="time-value">{{entry.from}}</div>
                                </div>
                            </div>
                            <div class="item-time-end">
                                <div class="time-entry-content">
                                    <div class="label">tot</div>
                                    <div class="time-value">{{entry.to}}</div>
                                </div>
                            </div>
                            <div class="item-delete">
                                <a @click="deleteTimezoneEntry(entry)">
                                    <img :src="require('@/assets/images/icons/icn_trash.svg')" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>

        <div class="wrapper save-section">

            <div class="slider-container">

                <a class="button is-rounded is-fullwidth save-challenge-btn">Challenge opslaan</a>

            </div>

            <div class="slider-container contains-container">

                <p>De volgende apps zijn onderdeel van deze challenge:</p><br />
                <p class="apps">Whatsapp, Facebook, Twitter, Pinterest, Instagram, Snapchat</p>

            </div>

        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {ChallengesState} from "@/store/challenges/types";
import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents);

interface timeEntry {
    id: number,
    from: string,
    to: string,
    swiped: boolean
}

@Component({
})
export default class Setup extends Vue {
    @State('challenges') challenges!: ChallengesState;
    //@Prop() msg: string = '';
    setupData: {
        items: timeEntry[]
    } = {
        items: [
            {
                id: 1,
                from: '08:30',
                to: '10:00',
                swiped: false
            },
            {
                id: 2,
                from: '20:30',
                to: '23:00',
                swiped: false
            }
        ]
    };

    //Cycle hooks
    mounted () {

    }

    showDelete( rowData: timeEntry )
    {
        console.log('swiped left')
        rowData.swiped = true
    }

    addTimezoneEntry(){
        this.setupData.items.push({
            id: Math.random(),
            from: '08:30',
            to: '10:00',
            swiped: false
        });
    }

    deleteTimezoneEntry(entry: timeEntry){
        this.setupData.items.splice(this.setupData.items.indexOf(entry), 1);
    }
}
</script>

<style lang="scss">
    @import "../../../sass/variables";
    #challengesTimezoneSetup{
        .timezones-container{
            padding: 30px;
            background-color: #f3f3f3;

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

            /*&.contains-container{
                background-color: #e7e7e7 !important;
                background-image: none;
                clip-path: polygon(0 20%, 100% 0%, 100% 100%, 0% 100%);
            }*/
        }

        @mixin time-value-style {
            .time-entry-content{
                .label{
                    color: #A8A8A8;
                    width: 100%;
                    padding: 8px 0 0 10px;
                    text-align: left;
                    font-size: 16px;
                }

                .time-value{
                    width: 100%;
                    font-size: 32px;
                    text-align: left;
                    padding-left: 10px;
                    font-family: Oswald, sans-serif;
                }
            }
        }

        .timezone-entries{
            background-color: #f3f3f3;
            margin-bottom: 20px;
            .item-wrapper{
                max-width: 100%;
                width: 100%;
                overflow-x: scroll;

                .item-inner{
                    background-image: linear-gradient(#fcfcfc, #f7f7f7);
                    height: 80px;
                    width: 125%;
                    display: block;
                    position: relative;

                    &.swiped{
                        margin-left: -25%;
                        transition: 1s;
                    }

                    .item-inner-wrapper{
                        width: 100%;
                        height: 80px;
                        position: relative;
                        display:flex;

                        .item-slot{
                            width: 25%;
                            display: inline-block;
                            border-right: 1px solid #f3f3f3;

                            img{
                                color: #f3f3f3;
                                margin-top: 36%;
                            }
                        }
                        .item-time-from{
                            width: 37.5%;
                            display: inline-block;
                            border-right: 1px solid #f3f3f3;

                            @include time-value-style;
                        }
                        .item-time-end{
                            width: 37.5%;
                            display: inline-block;

                            border-right: 1px solid #f3f3f3;
                            @include time-value-style;
                        }
                        .item-delete{
                            width: 25%;
                            display: inline-block;
                            background-color: $color-purple;

                            a{
                                display: block;

                                img{
                                    color: #f3f3f3;
                                    margin-top: 36%;
                                }
                            }
                        }
                    }
                }
            }
        }

        .save-challenge-btn{
            border-color: $color-blue;
            color:$color-blue;
            background-color:transparent;
            padding:5px 0;
            font-size:14px;
            text-transform: uppercase;
            font-weight: bold;
        }
    }
</style>