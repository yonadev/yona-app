<template>
    <div id="challengesTimezoneSetup">

        <div class="wrapper grey-bg">
            <div class="timezones-container">
                <div class="columns is-mobile">
                    <div class="column challengeInfoColumn">
                        <strong>Tijdzone</strong>
                        <p>waarbinnen gebruik is toegestaan</p>
                    </div>
                    <div class="column is-one-fifth add-tz-btn">
                        <a @click="addTimezoneEntry()">
                            <img :src="require('@/assets/images/challenges/add_circel.svg')" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="wrapper grey-bg">

            <div class="timezone-entries">

                <swipe-list
                    ref="list"
                    :items="setupData.items"
                    item-key="id"
                >
                    <template v-slot="{ item, index}">
                        <div ref="content" class="item-wrapper">
                            <div class="item-inner">
                                <div class="item-slot">
                                    <img :src="require('@/assets/images/icons/icn_bounds.svg')" />
                                </div>
                                <div class="item-time-from">
                                    <div class="time-entry-content">
                                        <div class="label">van</div>
                                        <div class="time-value">{{item.from}}</div>
                                    </div>
                                </div>
                                <div class="item-time-end">
                                    <div class="time-entry-content">
                                        <div class="label">tot</div>
                                        <div class="time-value">{{item.to}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-slot:right="{ item }">
                        <div class="item-delete">
                            <a @click="deleteTimezoneEntry(item)">
                                <img :src="require('@/assets/images/icons/icn_trash.svg')" />
                            </a>
                        </div>
                    </template>
                </swipe-list>

            </div>

        </div>

        <div class="wrapper over-all-footer">
            <div class="wrapper grey-bg save-section">
                <a class="button is-rounded is-fullwidth save-challenge-btn">Challenge opslaan</a>
            </div>

            <div class="wrapper contains-container">
                <div class="columns is-mobile">
                    <div class="column is-three-fifths is-offset-one-fifth">
                        <p>De volgende apps zijn onderdeel van deze challenge:</p><br />
                        <p class="apps">Whatsapp, Facebook, Twitter, Pinterest, Instagram, Snapchat</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {State} from "vuex-class";
import {ChallengesState} from "@/store/challenges/types";

//@ts-ignore
import { SwipeList, SwipeOut } from 'vue-swipe-actions';

interface timeEntry {
    id: number,
    from: string,
    to: string,
    swiped: boolean
}

@Component({
    components: {SwipeList, SwipeOut}
})
export default class Setup extends Vue {
    @State('challenges') challenges!: ChallengesState;

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
    @import "~vue-swipe-actions/src/styles/vue-swipe-actions.css";
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

            .add-tz-btn{
                font-size: 30px;
                text-align: right;
            }
        }

        .timezone-entries{
            background-color: #f3f3f3;
            margin-bottom: 20px;
            .swipeout-list{
                max-width: 100%;
                width: 100%;
                .swipeout-list-item{
                    background-image: linear-gradient(#fcfcfc, #f7f7f7);
                    height: 80px;
                    width: 100%;
                    display: block;
                    position: relative;
                    flex: none;

                    .item-slot{
                        width: 25%;
                        float:left;
                        display: inline-block;
                        border-right: 1px solid #f3f3f3;
                        box-sizing: border-box;

                        img{
                            color: #f3f3f3;
                            width: 24px;
                            margin-top: 27px;
                        }
                    }
                    .item-time-from, .item-time-end{
                        width: 37.5%;
                        float:left;
                        display: inline-block;
                        border-right: 1px solid #f3f3f3;
                        box-sizing: border-box;

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

                    .item-time-end{
                        border: none;
                    }

                    .swipeout-right {
                        width: 25%;

                        .item-delete{
                            text-align: center;
                            background-color: $color-purple;
                            width: 100%;
                            a{
                                display: block;

                                img{
                                    color: #f3f3f3;
                                    width: 24px;
                                    margin-top: 27px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>