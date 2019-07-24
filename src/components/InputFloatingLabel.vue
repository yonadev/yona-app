<template>
  <div class="control has-icons-right">
    <div
      class="input-floating-label"
      :class="{
        'is-focused': isFocused || isFilled,
        'is-disabled': disabled,
        'has-error': errors.has(id)
      }"
    >
      <input
        :id="id"
        :name="id"
        :title="name"
        :disabled="disabled"
        v-validate="validate ? validate : {}"
        class="input"
        :data-vv-as="name"
        :type="type"
        v-model="model"
        @focus="focusInput"
        @blur="focusInput"
      />
      <label :for="id">{{ label }}</label>
      <span class="icon is-small is-right">
        <img :src="require('../assets/images/icons/' + icon)" />
      </span>
    </div>
    <span v-if="errors.has(id)" class="input-error">{{
      errors.first(id)
    }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component, Inject } from "vue-property-decorator";
import { Validator } from "vee-validate";

@Component({})
export default class InputFloatingLabel extends Vue {
  @Prop() id!: string;
  @Prop() label!: string;
  @Prop() icon!: string;
  @Prop() type!: string;
  @Prop() disabled!: boolean;
  @Prop() value!: string;
  @Prop() pattern!: string;
  @Prop() validate!: string;
  @Prop() name!: string;
  private isFocused: boolean = false;

  @Inject("$validator") $validator!: Validator;

  get model(): string {
    return this.value;
  }

  set model(value) {
    this.$emit("update:value", value);
  }

  get isFilled(): boolean {
    return this.value.length > 0;
  }

  focusInput() {
    if (!this.isFilled) this.isFocused = !this.isFocused;
  }
}
</script>

<style lang="scss">
@import "../sass/variables";

.control {
  padding-top: 30px;
  &.grey-bg-input {
    background-image: linear-gradient(#f7f7f7, #fcfcfc);
    padding: 20px 25px 10px 25px;
  }
  &.with-border-input {
    .input-floating-label {
      input {
        border-bottom: 2px solid #f3f3f3 !important;
      }
      &.has-error {
        input {
          border-color: #cc0000 !important;
        }
      }
    }
  }
  .icon {
    width: auto;
    top: 5px !important;
  }
  .input-error {
    display: block;
    padding-top: 5px;
    color: #cc0000;
  }
  .input-floating-label {
    position: relative;
    box-sizing: border-box;
    input {
      width: 90%;
      font-family: $font-family;
      font-weight: 500;
      letter-spacing: 1px;
      padding: 10px 0 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      border: 0 !important;
      height: 35px;
      background-color: transparent;
      outline: 0 !important;
      &[disabled] {
        background-color: transparent;
      }
    }
    label {
      bottom: 0;
      text-align: left;
      color: rgba(0, 0, 0, 0.26);
      font-weight: 500;
      pointer-events: none;
      position: absolute;
      display: block;
      top: 10px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-transform: uppercase;
    }
    &.is-focused {
      label {
        top: 0;
      }
    }
    &.is-focused:not(.is-disabled, .has-error) {
      input {
        border-color: $color-purple-dark !important;
      }
      label {
        transition-duration: 0.1s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        color: $color-purple-dark;
      }
    }
  }
}
</style>
