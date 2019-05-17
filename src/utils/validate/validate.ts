import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
//@ts-ignore
import nl from "vee-validate/dist/locale/nl";

const dictionary = {
  // attributes and messages
  messages: {
    mobile: (fieldName: string, params: any[], data?: any) => {
      return `${fieldName} is niet geldig.`;
    }
  }
};

Vue.use(VeeValidate)

Validator.localize('nl', nl); // changes the locale
Validator.localize('nl', dictionary); // overwrites some messages

Validator.extend('mobile', {
  validate: function (value) {
    return /^(((\+31)6){1}[1-9]{1}[0-9]{7})$/i.test(value)
  }
})