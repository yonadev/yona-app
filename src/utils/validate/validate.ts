import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';

import {parsePhoneNumberFromString} from "libphonenumber-js/mobile"

Vue.use(VeeValidate)

Validator.extend('mobile', {
  validate: function (value) {
    const number = parsePhoneNumberFromString(value)

    return (number !== undefined && number.isValid());
  }
});