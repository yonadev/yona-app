<template>
  <div class="control has-icons-right">
    <div class="input-floating-label" :class="{'is-focused': isFocused || isFilled}">
      <input :ref="id" :id="id" :name="id" :title="id" class="input" :type="type" v-model="value" @keyup="handleSubmit($event)" @focus="focusInput" @blur="focusInput" />
      <label :for="id">{{label}}</label>
    </div>
    <span class="icon is-small is-right">
      <img :src="require('../assets/images/icons/'+icon)" />
    </span>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'

  @Component({})
  export default class InputFloatingLabel extends Vue {
    @Prop() id!: string;
    @Prop() label!: string;
    @Prop() icon!: string;
    @Prop() type!: string;
    private value: string = '';
    private isFocused: boolean = false;

    get isFilled (): boolean {
      return this.value.length > 0
    }

    focusInput () {
      if(!this.isFilled)
        this.isFocused = !this.isFocused;
    }

    handleSubmit () {
      this.$emit('input', this.value)
    }
  }
</script>

<style lang="scss">
  @import "../sass/variables";

  .control{
    margin-top: 30px;
    .icon{
      width:auto;
    }
    .input-floating-label {
      box-sizing: border-box;
      input {
        font-family: $font-family;
        font-weight: 500;
        letter-spacing: 1px;
        padding: 10px 0 0px !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: 0 !important;
        border-bottom: 2px solid #f3f3f3 !important;
        height: 35px;
      }
      label {
        bottom: 0;
        color: rgba(0, 0, 0, .26);
        font-weight: 500;
        pointer-events: none;
        position: absolute;
        display: block;
        top: 10px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
      }
      &.is-focused {
        input {
          border-color: $color-purple-dark !important;
        }
        label {
          transition-duration: .1s;
          transition-timing-function: cubic-bezier(.4, 0, .2, 1);
          top: 0;
          color: $color-purple-dark;
        }
      }
    }
  }
</style>