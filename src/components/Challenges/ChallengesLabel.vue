<template>
  <div class="ui-controls">
    <div class="top-label">
      <strong>{{activityCategory.name}}</strong>
      <strong>{{goal['@type']}}</strong>
      <strong>{{goal.maxDurationMinutes}}</strong>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import axios from "@/utils/axios/axios";

  @Component({})

  export default class ChallengesLabel extends Vue {
    @Prop() goal!: {
      '@type': string,
      creationTime: string,
      historyItem: boolean
      maxDurationMinutes: number
      _links: {
        self: {
          href: string
        },
        'yona:activityCategory': {
          href: string
        }
      }
    };

    activityCategory: {
      applications: [any],
      description: string,
      name: string
    } = {};

    async mounted() {
      const activityCategory : any = await axios.get(this.goal._links["yona:activityCategory"].href).catch(error => {
        console.log(error)
      });

      if(activityCategory.status === 200) {
        this.activityCategory = activityCategory.data
      }
    }

  }
</script>

<style lang="scss">
  .ui-controls{
    min-height:50px;
    .top-label{
      background:#e7e7e7;
      padding: 17px;
      font-size: 11px;
      opacity: 0.6;
      border-bottom:1px solid #d5d5d5;
      border-top:1px solid #d5d5d5;
    }
  }
</style>