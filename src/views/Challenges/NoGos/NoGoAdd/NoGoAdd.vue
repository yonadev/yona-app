<template>
  <div>
    <h3>Add a nogo challenge</h3>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'

@Component({})
export default class NoGoAdd extends Vue {
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