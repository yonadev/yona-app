import Vue from "vue";
import VeeValidate, { Validator } from "vee-validate";

import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";

Vue.use(VeeValidate);

Validator.extend("mobile", {
  validate(value) {
    const phoneNumber = parsePhoneNumberFromString(value);

    return phoneNumber !== undefined && phoneNumber.isValid();
  }
});
