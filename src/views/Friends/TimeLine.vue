<template>
  <div>
    Friends - Timeline
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'

@Component({})
export default class TimeLine extends Vue {
    //@Prop() msg: string = '';

    //Cycle hooks
    mounted () {
    }

    //Computed properties
    get computedMsg () {
        return '';
    }

    //Methods
    methodFunction () {
    }
}
</script>

<style scoped lang="scss">
</style>