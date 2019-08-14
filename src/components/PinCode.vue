<template>
  <div class="pincode">
    <label for="pin-input">
      <ul>
        <li class="field-wrap" v-for="(item, index) in length" :key="index">
          <span v-if="pincode && pincode[index]" class="dot"></span>
        </li>
      </ul>
      <input
        ref="input"
        class="input-code"
        @keyup="handleInput($event)"
        @paste="handlePaste($event)"
        :value="pincode"
        id="pin-input"
        name="pin-input"
        type="number"
        :maxlength="length"
        autocomplete="off"
        autocapitalize="off"
      />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "@/utils/eventbus";
import { Prop, Component } from "vue-property-decorator";

@Component({})
export default class PinCode extends Vue {
  @Prop() length: number = 4;
  @Prop() pincode!: number;

  mounted() {
    this.showKeyboard();
    EventBus.$on("device-ready", this.showKeyboard);
  }

  showKeyboard() {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.focus(); // ios
    if (this.$refs.input instanceof HTMLElement) this.$refs.input.focus(); // android
  }

  hideKeyboard() {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur(); // ios
    if (this.$refs.input instanceof HTMLElement) this.$refs.input.blur(); // android
  }

  handlePaste(e: any) {
    const self = this;
    setTimeout(() => {
      self.handleInput(e);
    }, 0);
    return true;
  }

  handleInput(e: any) {
    if (e.target.value.length >= this.length) this.hideKeyboard();
    this.$emit("update:pincode", e.target.value);
  }
}
</script>

<style lang="scss">
@import "../sass/variables";

.pincode {
  label {
    position: relative;
    display: block;

    ul {
      padding: 0;
      display: block;

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
        color: #2f2f2f;
        @media (max-width: $xxs-maxwidth) {
          width: 55px;
          height: 55px;
          margin: 7px;
        }

        .dot {
          &:before {
            content: " ";
            width: 12px;
            display: block;
            margin: 9px;
            height: 12px;
            background: black;
            border-radius: 12px;
          }
        }
      }
    }
    .input-code {
      background: none;
      outline: none;
      border: none;
      padding: 0px 25px;
      color: transparent;
      letter-spacing: 70px;
      position: absolute;
      top: 9px;
      left: 50%;
      margin-left: -147px;
      width: 290px;
      height: 60px;
    }
  }
}
</style>
