<template>
  <div>
    Signup first and lastname
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'

@Component({})
export default class Names extends Vue {
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