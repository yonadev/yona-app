<template>
  <div>
    <div v-for="(day_activities, index) in dayActivityOverviews" :key="'day'+index">
        <ui-controls-label :buddy_href="buddy_href" :day_activities="day_activities"></ui-controls-label>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import {Getter, State} from "vuex-class";
  import axios from "@/utils/axios/axios"
  import UiControlsLabel from "@/components/UiControls/UiControlsLabel.vue";
  import {Prop} from "vue-property-decorator";
  import {Buddy} from "@/store/buddies/types";

  @Component({
    components: {
      UiControlsLabel
    }
  })
  export default class FriendsTimeLineDay extends Vue {

    @Prop() buddy_href!: string;

    @Getter('buddy', {namespace: 'buddies'})
    public buddy!: (buddy_href: string) => Buddy;

    get buddyProfile(){
      return this.buddy(this.buddy_href);
    }

    dayActivityOverviews: [{}] = [{}];

    async mounted () {
      let daily_response = await axios.get(this.buddyProfile._links['yona:dailyActivityReports'].href);

        if (daily_response.status == 200)
            this.dayActivityOverviews = daily_response.data._embedded['yona:dayActivityOverviews'];
    }
  }
</script>

<style lang="scss">
</style>