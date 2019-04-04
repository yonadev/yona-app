<template>
  <div class="pincode">
    <label for="pin-input">
      <ul>
        <li class="field-wrap" v-for="(item, index) in length" :key="index">
          <span v-if="pincode && pincode[index]">&#11044;</span>
        </li>
      </ul>
    </label>
    <input ref="input" class="input-code" @keyup="handleInput($event)" :value="pincode"
           id="pin-input" name="pin-input" type="number" :maxlength="length"
           autocomplete="off" autocapitalize="off">
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'

  @Component({})
  export default class PinCode extends Vue {
    @Prop() length: number = 4;
    @Prop() pincode!: number;

    hideKeyboard () {
      if(document.activeElement instanceof HTMLElement)
        document.activeElement.blur() // ios
      if( this.$refs.input instanceof HTMLElement)
        this.$refs.input.blur() // android
    }

    handleInput (e: any) {
      if (e.target.value.length >= this.length)
        this.hideKeyboard()

      this.$emit('update:pincode', e.target.value)
    }
  }
</script>

<style lang="scss">
  .pincode{
    ul{
      padding:0;
      li {
        vertical-align: top;
        background: #fff;
        display: inline-block;
        height: 60px;
        width: 60px;
        margin: 9px;
        text-align: center;
        font-size: 1.5em;
        padding: 15px;
        box-sizing: border-box;
        color:#2f2f2f;
      }
    }
    .input-code{
      position: absolute;
      left: -9999px;
      top: -9999px;
    }
  }
</style>